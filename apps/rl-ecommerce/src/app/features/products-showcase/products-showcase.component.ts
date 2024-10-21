import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import { NavigationEnd, Router } from '@angular/router';
import { filter, Observable, of } from 'rxjs';
import * as events from 'events';
import { ProductOptionsService } from '../product-options/services/product-options.service';
import { ISavedProductOptionQueries } from '../product-options/models/product-options.interface';

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
  private router = inject(Router);
  private productService = inject(ProductsService);
  private optionsService = inject(ProductOptionsService);
  private cdr = inject(ChangeDetectorRef);
  isMobileFilterOpened = this.layoutService.mobileFilterOpened;
  products$!: Observable<any>;
  ngOnInit() {
    const savedQuery: ISavedProductOptionQueries = JSON.parse(
      sessionStorage.getItem('hshs82haa02sshs92s')!,
    );

    const newQuery = {
      categoryId: savedQuery?.category?.id,
      subCategoryId: savedQuery?.subCategory?.id,
    };

    this.products$ = this.productService.getProducts(newQuery);
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const category = this.optionsService.currentCategory();
        const subCategory = this.optionsService.currentSubCategory();
        this.products$ = this.productService.getProducts({
          categoryId: category?.id,
          subCategoryId: subCategory?.id,
        });
        this.cdr.detectChanges();
      });
  }

  onOpenMobileFilter() {
    this.layoutService.mobileFilterOpened.set(true);
  }
}
