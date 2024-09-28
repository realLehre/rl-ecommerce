import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { LayoutService } from '../../../shared/services/layout.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgClass],
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
