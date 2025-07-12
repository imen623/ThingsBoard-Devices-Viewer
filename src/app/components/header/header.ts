import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class HeaderComponent {
  popoverOpen = false;
  constructor(private authService: AuthService) {}
  togglePopover() {
    this.popoverOpen = !this.popoverOpen;
  }

  logout() {
    this.authService.logout();
  }
}
