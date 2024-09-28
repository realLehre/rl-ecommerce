import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/components/header/header.component';
import { MobileNavComponent } from './features/homepage/mobile-nav/mobile-nav.component';
import { LayoutService } from './shared/services/layout.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, MobileNavComponent, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private layoutService = inject(LayoutService);
  isMenuOpened = this.layoutService.menuOpened;
}
