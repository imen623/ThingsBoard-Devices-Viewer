import { Routes } from '@angular/router';
import { ApiPage } from './api-page/api-page';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent }, // This route will display LoginComponent when the URL is /login
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirects the root path to /login  { path: 'ApiPage', component: ApiPage },
  {
    path: 'pages',
    loadChildren: () =>
      import('./pages/pages-module').then((m) => m.PagesModule),
  },
];
