import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AdminSidenavComponent } from './admin-sidenav/admin-sidenav.component';
import { AdminMainComponent } from './admin-main/admin-main.component';
import { MobileAdminSidenavComponent } from './mobile-admin-sidenav/mobile-admin-sidenav.component';
import { LayoutService } from '../../shared/services/layout.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    AdminSidenavComponent,
    AdminMainComponent,
    MobileAdminSidenavComponent,
    NgClass,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
  private readonly layoutService = inject(LayoutService);
  isMenuOpened = this.layoutService.adminMenuOpened;
}
