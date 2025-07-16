import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private thingsboardBaseUrl = 'https://demo.thingsboard.io/api';
  private laravelApiBaseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getData(
    deviceId: string = '424363c0-5e51-11f0-83dd-65e1b21422bc'
  ): Observable<any> {
    const url = `${this.thingsboardBaseUrl}/plugins/telemetry/DEVICE/${deviceId}/values/timeseries?keys=temperature`;
    const token = sessionStorage.getItem('token'); // ThingsBoard token

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('X-Authorization', `Bearer ${token}`);
    }

    return this.http.get<any>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching data from ThingsBoard:', error);
        return throwError(
          () => new Error('Failed to load data from ThingsBoard.')
        );
      })
    );
  }

  validateThingsBoardDeviceId(deviceId: string): Observable<boolean> {
    const url = `${this.thingsboardBaseUrl}/plugins/telemetry/DEVICE/${deviceId}/values/timeseries`;
    const token = sessionStorage.getItem('token'); // ThingsBoard token

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('X-Authorization', `Bearer ${token}`);
    } else {
      return throwError(
        () =>
          new Error('ThingsBoard token is missing. Cannot validate device ID.')
      );
    }

    return this.http.get<any>(url, { headers }).pipe(
      map(() => true),
      catchError((error) => {
        console.error('ThingsBoard device ID validation failed:', error);
        return throwError(
          () => new Error('No device found with this ID or access denied.')
        );
      })
    );
  }

  getDevices(): Observable<any[]> {
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http
      .get<any[]>(`${this.laravelApiBaseUrl}/devices`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error fetching devices from Laravel:', error);
          return throwError(
            () => new Error('Failed to fetch devices from backend.')
          );
        })
      );
  }

  saveDevice(deviceData: {
    name: string;
    type: string;
    thingsboard_device_id: string;
  }): Observable<any> {
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    } else {
      return throwError(
        () => new Error('Authentication token is missing. Cannot save device.')
      );
    }

    return this.http
      .post<any>(`${this.laravelApiBaseUrl}/devices`, deviceData, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error saving device to Laravel:', error);
          const errorMessage =
            error.error?.message || 'Failed to save device to backend.';
          return throwError(() => new Error(errorMessage));
        })
      );
  }
}
