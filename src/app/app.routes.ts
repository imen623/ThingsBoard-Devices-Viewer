import { Routes } from '@angular/router';
import { ApiPage } from './api-page/api-page';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'ApiPage', component: ApiPage },
];
