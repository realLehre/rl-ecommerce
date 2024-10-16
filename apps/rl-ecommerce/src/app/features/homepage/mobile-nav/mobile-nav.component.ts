import { Component, inject, OnInit } from '@angular/core';
import { CategoriesComponent } from '../../product-options/categories/categories.component';
import { FeaturedProductComponent } from '../../product-options/featured-product/featured-product.component';
import { LayoutService } from '../../../shared/services/layout.service';

@Component({
  selector: 'app-mobile-nav',
  standalone: true,
  imports: [CategoriesComponent, FeaturedProductComponent],
  templateUrl: './mobile-nav.component.html',
  styleUrl: './mobile-nav.component.scss',
})
export class MobileNavComponent implements OnInit {
  private layoutService = inject(LayoutService);
  ngOnInit() {}

  onCloseMenu() {
    this.layoutService.menuOpened.set(false);
  }
}
