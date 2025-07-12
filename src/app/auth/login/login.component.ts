import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

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
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  onSubmit() {
    if (this.loginForm.valid) {
      const url = 'https://demo.thingsboard.io/api/auth/login';
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      const body = {
        username: this.loginForm.value.email,
        password: this.loginForm.value.password,
      };

      this.http.post<any>(url, body, { headers }).subscribe({
        next: (res) => {
          sessionStorage.setItem('token', res.token);
          this.router.navigate(['/pages']);
        },
        error: (err) => {
          alert('Login failed: ' + err.error?.message || 'Unknown error');
        },
      });
    }
  }
  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
