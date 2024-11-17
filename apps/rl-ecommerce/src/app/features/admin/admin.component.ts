import { Component } from '@angular/core';
import { AdminSidenavComponent } from './admin-sidenav/admin-sidenav.component';
import { AdminMainComponent } from './admin-main/admin-main.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [AdminSidenavComponent, AdminMainComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {}
