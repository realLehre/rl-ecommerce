import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ProductCardComponent } from './product-card/product-card.component';
import { MobileFiltersComponent } from '../product-options/mobile-filters/mobile-filters.component';
import { LayoutService } from '../../shared/services/layout.service';
import { AsyncPipe, CurrencyPipe, NgClass } from '@angular/common';
import { ProductsService } from '../products/services/products.service';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-products-showcase',
  standalone: true,
  imports: [
    ProductCardComponent,
    MobileFiltersComponent,
    NgClass,
    AsyncPipe,
    CurrencyPipe,
    SkeletonModule,
  ],
  templateUrl: './products-showcase.component.html',
  styleUrl: './products-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsShowcaseComponent implements OnInit {
  private layoutService = inject(LayoutService);
  private productService = inject(ProductsService);
  isMobileFilterOpened = this.layoutService.mobileFilterOpened;
  products$ = this.productService.getProducts();
  ngOnInit() {}

  onOpenMobileFilter() {
    this.layoutService.mobileFilterOpened.set(true);
  }
}
