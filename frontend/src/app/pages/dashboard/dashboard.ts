import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatDialogModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  loading = true;
  error: string | null = null;
  isModalOpen = false;
  selectedItem: any;
  showAddDeviceModal = false;
  devices: any[] = [];
  idError = false;
  idErrorMessage: string | null = null;
  savingDevice = false;

  // --- NEW: Map to store telemetry for each device ---
  // Key: ThingsBoard Device ID (string)
  // Value: The telemetry value (e.g., temperature number)
  deviceTelemetry: Map<string, number | string> = new Map();
  // --- NEW: Map to track telemetry loading state per device ---
  telemetryLoading: Map<string, boolean> = new Map();
  telemetryError: Map<string, string | null> = new Map();

  newDevice = {
    name: '',
    id: '',
    type: 'sensor',
  };

  constructor(private apiService: ApiService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchDevices();
  }

  fetchDevices(): void {
    this.loading = true;
    this.apiService
      .getDevices()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (devices) => {
          this.devices = Array.isArray(devices) ? devices : [];
          this.error = null;

          // fetch telemetry for each device after they are loaded
          this.devices.forEach((device) => {
            if (device.thingsboard_device_id) {
              this.fetchTelemetryForDevice(device.thingsboard_device_id);
            }
          });
        },
        error: (err) => {
          console.error('Error fetching devices:', err);
          this.error = err.message || 'Failed to load devices.';
          this.devices = [];
        },
      });
  }

  // fetch telemetry for a specific device ID
  fetchTelemetryForDevice(deviceId: string): void {
    this.telemetryLoading.set(deviceId, true);
    this.telemetryError.set(deviceId, null);

    this.apiService
      .getData(deviceId)
      .pipe(finalize(() => this.telemetryLoading.set(deviceId, false)))
      .subscribe({
        next: (response) => {
          //  response.temperature : array { ts: number, value: string }
          if (
            response &&
            response.temperature &&
            response.temperature.length > 0
          ) {
            const latestTemperature = response.temperature[0].value;
            this.deviceTelemetry.set(deviceId, Number(latestTemperature));
          } else {
            this.deviceTelemetry.set(deviceId, 'N/A');
          }
        },
        error: (err) => {
          console.error(`Error fetching telemetry for ${deviceId}:`, err);
          this.deviceTelemetry.set(deviceId, 'Error');
          this.telemetryError.set(deviceId, 'Failed to load telemetry.');
        },
      });
  }

  openAddDeviceModal(): void {
    this.showAddDeviceModal = true;
    this.idError = false;
    this.idErrorMessage = null;
    this.newDevice = { name: '', id: '', type: 'sensor' };
  }

  closeAddDeviceModal(): void {
    this.showAddDeviceModal = false;
    this.idError = false;
    this.idErrorMessage = null;
    this.savingDevice = false;
  }

  saveNewDevice(): void {
    this.idError = false;
    this.idErrorMessage = null;
    this.savingDevice = true;

    this.apiService
      .validateThingsBoardDeviceId(this.newDevice.id)
      .pipe(finalize(() => (this.savingDevice = false)))
      .subscribe({
        next: (isValid) => {
          if (isValid) {
            const deviceToSave = {
              name: this.newDevice.name,
              type: this.newDevice.type,
              thingsboard_device_id: this.newDevice.id,
            };

            this.apiService.saveDevice(deviceToSave).subscribe({
              next: (savedDevice) => {
                console.log('Device saved to Laravel:', savedDevice);
                this.devices.push(savedDevice);
                this.closeAddDeviceModal();
                this.error = null;

                // fetch telemetry for the newly added device
                if (savedDevice.thingsboard_device_id) {
                  this.fetchTelemetryForDevice(
                    savedDevice.thingsboard_device_id
                  );
                }
              },
              error: (saveErr) => {
                console.error('Error saving device to Laravel:', saveErr);
                this.error = saveErr.message || 'Failed to save device.';
              },
            });
          } else {
            this.idError = true;
            this.idErrorMessage = 'ThingsBoard ID validation failed.';
          }
        },
        error: (validationErr) => {
          this.idError = true;
          this.idErrorMessage =
            validationErr.message ||
            `Cannot find device with ID: ${this.newDevice.id}`;
          console.error('ThingsBoard ID validation error:', validationErr);
        },
      });
  }

  openModal(item: any): void {
    this.selectedItem = item;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }
}
