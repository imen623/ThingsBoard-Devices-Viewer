import { Component, ChangeDetectorRef } from '@angular/core';
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
  popoverOpenMenu = false;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  togglePopover() {
    this.popoverOpenMenu = !this.popoverOpenMenu;
    this.cdr.detectChanges(); // force update
  }

  logout() {
    this.authService.logout();
    this.popoverOpenMenu = false;
    this.cdr.detectChanges(); // force update
  }
}
