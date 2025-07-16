import { Routes } from '@angular/router';
import { ApiPage } from './api-page/api-page';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'ApiPage', component: ApiPage }, //to remove
  {
    path: 'pages',
    loadChildren: () =>
      import('./pages/pages-module').then((m) => m.PagesModule),
  },
];
