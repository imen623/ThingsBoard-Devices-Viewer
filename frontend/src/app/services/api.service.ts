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
    const url = `${this.thingsboardBaseUrl}/plugins/telemetry/DEVICE/${deviceId}/values/timeseries`;
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
  /**
   * Sends an HTTP PUT request to update an existing device on the Laravel backend.
   * @param id The ID of the device to update (from your Laravel database).
   * @param deviceData The data to update for the device (e.g., name, type, info).
   * @returns An Observable of the updated device.
   */
  updateDevice(
    id: number | string,
    deviceData: { name?: string; type?: string; info?: string }
  ): Observable<any> {
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    } else {
      return throwError(
        () =>
          new Error('Authentication token is missing. Cannot update device.')
      );
    }

    return this.http
      .put<any>(`${this.laravelApiBaseUrl}/devices/${id}`, deviceData, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error(
            `Error updating device with ID ${id} on Laravel:`,
            error
          );
          const errorMessage =
            error.error?.message || 'Failed to update device on backend.';
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  /**
   * Sends an HTTP DELETE request to remove a device from the Laravel backend.
   * @param id The ID of the device to delete.
   * @returns An Observable that completes on successful deletion.
   */
  deleteDevice(id: number | string): Observable<void> {
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders(); // No Content-Type needed for DELETE
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    } else {
      return throwError(
        () =>
          new Error('Authentication token is missing. Cannot delete device.')
      );
    }

    return this.http
      .delete<void>(`${this.laravelApiBaseUrl}/devices/${id}`, { headers })
      .pipe(
        catchError((error) => {
          console.error(
            `Error deleting device with ID ${id} from Laravel:`,
            error
          );
          const errorMessage =
            error.error?.message || 'Failed to delete device from backend.';
          return throwError(() => new Error(errorMessage));
        })
      );
  }
}
