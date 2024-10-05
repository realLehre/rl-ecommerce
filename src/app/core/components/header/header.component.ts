import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { LayoutService } from '../../../shared/services/layout.service';
import { RouterLink } from '@angular/router';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgClass, RouterLink, MenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private layoutService = inject(LayoutService);

  searchShown: boolean = false;
  onToggleSearch() {
    this.searchShown = !this.searchShown;
  }

  onOpenMenu() {
    this.layoutService.menuOpened.set(true);
  }
}
