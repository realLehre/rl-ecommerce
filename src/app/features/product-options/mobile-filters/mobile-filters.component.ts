import { Component, inject } from '@angular/core';
import { FiltersComponent } from '../filters/filters.component';
import { LayoutService } from '../../../shared/services/layout.service';

@Component({
  selector: 'app-mobile-filters',
  standalone: true,
  imports: [FiltersComponent],
  templateUrl: './mobile-filters.component.html',
  styleUrl: './mobile-filters.component.scss',
})
export class MobileFiltersComponent {
  private layoutService = inject(LayoutService);

  onCloseMenu() {
    this.layoutService.mobileFilterOpened.set(false);
  }
}
