import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-user-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './user-nav.component.html',
  styleUrl: './user-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserNavComponent implements AfterViewInit {
  router = inject(Router);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  activeTab: string;

  @ViewChildren('tabLink') tabLinks!: QueryList<ElementRef>;

  constructor() {
    this.activeTab = this.cleanUrl(this.router.url);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeTab = this.cleanUrl(event.url);
        setTimeout(() => {
          this.scrollToActiveTab();
        }, 0);
      }
    });
  }

  setActiveTab(route: string, event: MouseEvent) {
    this.activeTab = this.cleanUrl(route);
    setTimeout(() => {
      this.scrollToActiveTab();
    }, 100);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.scrollToActiveTab();
    }, 0);
  }

  scrollToActiveTab() {
    // Find the currently active link element
    if (this.tabLinks) {
      const activeLink = this.tabLinks.find(
        (tab) =>
          tab.nativeElement.getAttribute('routerLink') ===
          this.cleanUrl(this.activeTab),
      );

      if (activeLink) {
        activeLink.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }

  cleanUrl(url: string): string {
    return url.split('?')[0].split('#')[0];
  }

  onLogOut() {
    this.authService.signOut();
  }
}
