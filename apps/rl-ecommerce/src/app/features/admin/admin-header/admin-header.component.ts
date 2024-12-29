import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { PrimeTemplate } from 'primeng/api';
import { Router, RouterLink } from '@angular/router';
import { LayoutService } from '../../../shared/services/layout.service';
import { AuthService } from '../../auth/services/auth.service';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [MenuModule, PrimeTemplate, RouterLink, NgOptimizedImage],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminHeaderComponent {
  private readonly layoutService = inject(LayoutService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  isMenuOpened = this.layoutService.adminMenuOpened;

  onOpenMenu() {
    this.layoutService.adminMenuOpened.set(
      !this.layoutService.adminMenuOpened(),
    );
  }
  onSignOut() {
    this.authService.signOut();
    this.router.navigate(['/', 'auth']);
  }
}
