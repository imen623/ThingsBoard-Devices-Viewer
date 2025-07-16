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
    private authService: AuthService, // Inject AuthService instead of HttpClient
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value; // Get email and password from form

      this.authService.login(email, password).subscribe({
        // Inside LoginComponent's onSubmit next: (res) => { ... }
        next: (res) => {
          this.authService.saveToken(res.token); // Save ThingsBoard token
          const userEmail = this.loginForm.value.email; // Get the email used for login

          // Now call the Laravel registration API
          this.authService
            .registerWithThingsBoardToken(userEmail, res.token)
            .subscribe({
              next: (laravelRes) => {
                console.log('User registered with Laravel:', laravelRes);
                this.router.navigate(['/pages']); // Navigate after both operations are successful
              },
              error: (laravelErr) => {
                console.error(
                  'Laravel registration failed:',
                  laravelErr.error?.message || 'Unknown Laravel error',
                  laravelErr
                );
                // Decide how to handle this: navigate anyway, show error, etc.
                // this.router.navigate(['/pages']); // Or navigate only on successful Laravel registration
              },
            });
        },
        error: (err) => {
          // Replace alert() with console.error or a custom message display
          console.error(
            'Login failed:',
            err.error?.message || 'Unknown error',
            err
          );
          // You might want to display a user-friendly message in the UI here
        },
      });
    }
  }

  // If logout is triggered from the login page itself (less common),
  // it should also use the AuthService
  logout() {
    this.authService.logout(); // Use AuthService for logout
  }
}
