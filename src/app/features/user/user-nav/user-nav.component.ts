import {
  AfterViewInit,
  ChangeDetectionStrategy,
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
  activeTab: string;

  @ViewChildren('tabLink') tabLinks!: QueryList<ElementRef>;

  constructor() {
    // Set the active tab based on the current route
    this.activeTab = this.router.url;

    // Subscribe to route changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeTab = event.url; // Update active tab on route change
        this.scrollToActiveTab(); // Scroll the active tab into view on route change
      }
    });
  }

  setActiveTab(route: string, event: MouseEvent) {
    this.activeTab = route;
    this.scrollToActiveTab(); // Scroll to the active tab when clicked
  }

  ngAfterViewInit() {
    this.scrollToActiveTab(); // Scroll the active tab into view after the view is initialized
  }

  scrollToActiveTab() {
    // Find the currently active link element
    if (this.tabLinks) {
      const activeLink = this.tabLinks.find(
        (tab) =>
          tab.nativeElement.getAttribute('routerLink') === this.activeTab,
      );

      if (activeLink) {
        // Scroll the active link into view, smoothly
        activeLink.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }
}
