import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatDialogModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  data: any[] = [];
  sliderValue: number = 0;
  loading = true;
  error: string | null = null;
  isModalOpen = false;
  selectedItem: any;
  showAddDeviceModal = false;
  newDeviceName = '';
  newDeviceType = 'sensor';
  devices: any[] = [];
  idError = false;
  newDevice = {
    name: '',
    id: '',
    type: 'sensor',
  };
  constructor(private apiService: ApiService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchData();
  }
  openAddDeviceModal(): void {
    this.showAddDeviceModal = true;
    this.idError = false;
    this.newDevice = { name: '', id: '', type: 'sensor' };
  }

  closeAddDeviceModal(): void {
    this.showAddDeviceModal = false;
    this.idError = false;
  }

  saveNewDevice(): void {
    //check if ID valid
    if (!this.validateDeviceId(this.newDevice.id)) {
      this.idError = true;
      return;
    }

    //valid, save device
    this.devices.push({
      name: this.newDevice.name,
      id: this.newDevice.id,
      type: this.newDevice.type,
    });

    this.closeAddDeviceModal();
  }

  private validateDeviceId(id: string): boolean {
    // Replace with API
    return id.length >= 3 && /^[A-Za-z0-9]+$/.test(id);
  }

  fetchData(): void {
    this.apiService.getData().subscribe({
      next: (response) => {
        this.data = response.temperature;
        if (this.data.length > 0) {
          this.sliderValue = Number(this.data[0].value);
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load data';
        this.loading = false;
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
