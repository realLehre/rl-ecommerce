import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { LayoutService } from '../../../shared/services/layout.service';
import { RouterLink } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgClass, RouterLink, MenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private authService = inject(AuthService);
  user = this.authService.user;
  private layoutService = inject(LayoutService);

  searchShown: boolean = false;

  onSignOut() {
    this.authService.signOut();
  }
  onToggleSearch() {
    this.searchShown = !this.searchShown;
  }

  onOpenMenu() {
    this.layoutService.menuOpened.set(true);
  }
}
