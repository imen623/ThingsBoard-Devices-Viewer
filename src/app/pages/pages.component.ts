import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MENU_ITEMS } from './pages-menu';
import { HeaderComponent } from '../components/header/header';

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent {
  menu = MENU_ITEMS;
}
