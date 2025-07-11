import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideHttpClient } from '@angular/common/http';
import { LoginComponent } from './app/auth/login/login.component';

bootstrapApplication(LoginComponent, {
  providers: [provideHttpClient()],
});

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
