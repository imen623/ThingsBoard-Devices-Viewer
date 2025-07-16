// src/app/auth/auth.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs'; // Import Observable for type hinting

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Existing ThingsBoard login API URL
  private thingsboardLoginUrl = 'https://demo.thingsboard.io/api/auth/login';
  // New Laravel registration API URL
  // IMPORTANT: Replace 'YOUR_LARAVEL_API_BASE_URL' with the actual base URL of your Laravel application
  private laravelRegisterUrl = 'http://localhost:8000/api/thingsboard/register'; // Example: adjust port/domain as needed

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Authenticates a user with the ThingsBoard API.
   * @param email The user's email (username).
   * @param password The user's password.
   * @returns An Observable of the login response, typically containing a token.
   */
  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { username: email, password: password };

    return this.http.post<any>(this.thingsboardLoginUrl, body, { headers });
  }

  /**
   * Registers a user with the Laravel backend after they've obtained a ThingsBoard token.
   * This method sends the ThingsBoard token to your Laravel API for user creation/association.
   * @param email The user's email (will be used as 'username' in Laravel).
   * @param thingsboardToken The token received from ThingsBoard login.
   * @returns An Observable of the registration response from your Laravel API.
   */
  registerWithThingsBoardToken(
    email: string,
    thingsboardToken: string
  ): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = {
      username: email, // Laravel expects 'username' as email
      thingsboard_token: thingsboardToken, // Laravel expects 'thingsboard_token'
    };

    return this.http.post<any>(this.laravelRegisterUrl, body, { headers });
  }

  /**
   * Saves the provided token to session storage.
   * @param token The authentication token to save.
   */
  saveToken(token: string) {
    sessionStorage.setItem('token', token);
  }

  /**
   * Retrieves the authentication token from session storage.
   * @returns The token string or null if not found.
   */
  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  /**
   * Removes the token from session storage and navigates to the root route.
   */
  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
