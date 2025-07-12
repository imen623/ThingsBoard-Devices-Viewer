import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'https://demo.thingsboard.io/api';
  private tokenKey = 'token';

  constructor(private http: HttpClient) {}

  // Login and save token
  login(username: string, password: string): Observable<void> {
    const url = `${this.baseUrl}/auth/login`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { username, password };

    return this.http.post<{ token: string }>(url, body, { headers }).pipe(
      tap((res) => sessionStorage.setItem(this.tokenKey, res.token)),
      map(() => void 0), // Return void
      catchError((err) => throwError(() => err))
    );
  }

  // Get token from storage
  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  // Prepare auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  // Example: fetch telemetry data for a device (replace deviceId)
  getTelemetry(deviceId: string): Observable<any> {
    const url = `${this.baseUrl}/plugins/telemetry/DEVICE/${deviceId}/values/timeseries?keys=temperature`;
    return this.http
      .get<any>(url, { headers: this.getAuthHeaders() })
      .pipe(catchError((err) => throwError(() => err)));
  }

  // For your existing fetchData(), you can wrap getTelemetry or other endpoints
  getData(): Observable<any> {
    // Replace with a valid device ID from your ThingsBoard demo account
    const demoDeviceId = '424363c0-5e51-11f0-83dd-65e1b21422bc';
    return this.getTelemetry(demoDeviceId);
  }
}
