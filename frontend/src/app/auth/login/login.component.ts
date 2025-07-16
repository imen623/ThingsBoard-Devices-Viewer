// src/app/auth/login/login.component.ts
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, //  AuthService instead of HttpClient
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (res) => {
          this.authService.saveToken(res.token);
          const userEmail = this.loginForm.value.email;
          this.authService
            .registerWithThingsBoardToken(userEmail, res.token)
            .subscribe({
              next: (laravelRes) => {
                console.log('User registered with Laravel:', laravelRes);
                this.router.navigate(['/pages']);
              },
              error: (laravelErr) => {
                console.error(
                  'Laravel registration failed:',
                  laravelErr.error?.message || 'Unknown Laravel error',
                  laravelErr
                );
              },
            });
        },
        error: (err) => {
          console.error(
            'Login failed:',
            err.error?.message || 'Unknown error',
            err
          );
        },
      });
    }
  }
  logout() {
    this.authService.logout();
  }
}
