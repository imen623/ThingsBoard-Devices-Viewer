import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PagesRoutingModule } from './pages-routing-module';
import { Dashboard } from './dashboard/dashboard';

@NgModule({
  declarations: [],
  imports: [CommonModule, PagesRoutingModule, Dashboard, RouterModule],
})
export class PagesModule {}
