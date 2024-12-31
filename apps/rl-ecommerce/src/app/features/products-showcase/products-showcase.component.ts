import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ProductCardComponent } from './product-card/product-card.component';
import { MobileFiltersComponent } from '../product-options/mobile-filters/mobile-filters.component';
import { LayoutService } from '../../shared/services/layout.service';
import { AsyncPipe, NgClass } from '@angular/common';
import { ProductsService } from '../products/services/products.service';
import { SkeletonModule } from 'primeng/skeleton';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Observable } from 'rxjs';
import { ProductOptionsService } from '../product-options/services/product-options.service';
import { IProductResponse } from '../products/model/product.interface';
import { NgxPaginationModule } from 'ngx-pagination';
import { ItemsShowingPipe } from '../../shared/pipes/items-showing.pipe';

@Component({
  selector: 'app-products-showcase',
  standalone: true,
  imports: [
    ProductCardComponent,
    MobileFiltersComponent,
    NgClass,
    AsyncPipe,
    SkeletonModule,
    NgxPaginationModule,
    ItemsShowingPipe,
  ],
  templateUrl: './products-showcase.component.html',
  styleUrl: './products-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsShowcaseComponent implements OnInit {
  private layoutService = inject(LayoutService);
  private router = inject(Router);
  private productService = inject(ProductsService);
  private optionsService = inject(ProductOptionsService);
  private cdr = inject(ChangeDetectorRef);
  isMobileFilterOpened = this.layoutService.mobileFilterOpened;
  products$!: Observable<IProductResponse | null>;
  config = this.productService.paginationConfig;
  numberOfFilters = this.optionsService.numberOfFilters;

  ngOnInit() {
    this.products$ = this.productService.getProducts(
      this.optionsService.filter(),
    );
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.products$ = this.productService.getProducts(
          this.optionsService.filter(),
        );
        this.cdr.detectChanges();
      });
  }

  pageChange(event: any) {
    this.optionsService.currentPage.set(event);
    this.optionsService.setDataAndRoute();
    this.productService.productSignal.set(null);
    setTimeout(() => {
      window.scrollTo({
        top: 470,
        behavior: 'smooth',
      });
    }, 100);
  }

  onOpenMobileFilter() {
    this.layoutService.mobileFilterOpened.set(
      !this.layoutService.mobileFilterOpened(),
    );
  }
}
