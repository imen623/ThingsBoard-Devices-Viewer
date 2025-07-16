import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private thingsboardLoginUrl = 'https://demo.thingsboard.io/api/auth/login';
  private laravelRegisterUrl = 'http://localhost:8000/api/thingsboard/register';

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
      username: email,
      thingsboard_token: thingsboardToken,
    };

    return this.http.post<any>(this.laravelRegisterUrl, body, { headers });
  }

  saveToken(token: string) {
    sessionStorage.setItem('token', token);
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
