import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-api-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './api-page.html',
  styleUrls: ['./api-page.scss'],
})
export class ApiPage implements OnInit {
  data: any[] = [];
  sliderValue: number = 0;
  loading = true;
  error: string | null = null;

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchData();
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

  logout() {
    this.authService.logout();
  }
}
