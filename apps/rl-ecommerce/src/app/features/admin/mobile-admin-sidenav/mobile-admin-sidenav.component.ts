import { Component } from '@angular/core';
import { AdminSidenavComponent } from '../admin-sidenav/admin-sidenav.component';

@Component({
  selector: 'app-mobile-admin-sidenav',
  standalone: true,
  imports: [AdminSidenavComponent],
  templateUrl: './mobile-admin-sidenav.component.html',
  styleUrl: './mobile-admin-sidenav.component.scss',
})
export class MobileAdminSidenavComponent {}
