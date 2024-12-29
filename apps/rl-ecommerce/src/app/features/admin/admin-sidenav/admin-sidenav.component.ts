import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LayoutService } from '../../../shared/services/layout.service';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-admin-sidenav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgOptimizedImage],
  templateUrl: './admin-sidenav.component.html',
  styleUrl: './admin-sidenav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSidenavComponent {
  private readonly layoutService = inject(LayoutService);
  onCloseMenu() {
    this.layoutService.adminMenuOpened.set(false);
  }
}
