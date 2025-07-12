import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  data: any[] = [];
  sliderValue: number = 0;
  loading = true;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

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
}
