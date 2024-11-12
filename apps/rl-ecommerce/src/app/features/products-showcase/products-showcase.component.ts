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
import { AsyncPipe, CurrencyPipe, NgClass } from '@angular/common';
import { ProductsService } from '../products/services/products.service';
import { SkeletonModule } from 'primeng/skeleton';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Observable, of } from 'rxjs';
import * as events from 'events';
import { ProductOptionsService } from '../product-options/services/product-options.service';
import { ISavedProductOptionQueries } from '../product-options/models/product-options.interface';
import { IProductResponse } from '../products/model/product.interface';
import { NgxPaginationModule, PaginationInstance } from 'ngx-pagination';
import { ItemsShowingPipe } from '../../shared/pipes/items-showing.pipe';
import { NumberOfFiltersPipe } from '../../shared/pipes/number-of-filters.pipe';

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
    NgxPaginationModule,
    ItemsShowingPipe,
    NumberOfFiltersPipe,
  ],
  templateUrl: './products-showcase.component.html',
  styleUrl: './products-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsShowcaseComponent implements OnInit {
  private layoutService = inject(LayoutService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private productService = inject(ProductsService);
  private optionsService = inject(ProductOptionsService);
  private cdr = inject(ChangeDetectorRef);
  isMobileFilterOpened = this.layoutService.mobileFilterOpened;
  products$!: Observable<IProductResponse | null>;
  config = this.productService.paginationConfig;
  currentPriceFilter = this.optionsService.currentPriceFilter;
  currentSort = this.optionsService.currentSort;
  ngOnInit() {
    const savedQuery: ISavedProductOptionQueries = JSON.parse(
      sessionStorage.getItem('hshs82haa02sshs92s')!,
    );

    const newQuery = {
      categoryId: savedQuery?.category?.id,
      subCategoryId: savedQuery?.subCategory?.id,
      page: savedQuery?.page,
      minPrice: savedQuery?.price?.min,
      maxPrice: savedQuery?.price?.max,
      sortBy: savedQuery?.sort,
    };

    const routeQuery = {
      category: this.productService.createSlug(savedQuery?.category?.name!),
      subCategory: this.productService.createSlug(
        savedQuery?.subCategory?.name!,
      ),
      page: savedQuery?.page,
      minPrice: savedQuery?.price?.min,
      maxPrice: savedQuery?.price?.max,
      sortBy: savedQuery?.sort,
    };

    const filteredQuery = Object.fromEntries(
      Object.entries(routeQuery).filter(([_, value]) => value !== undefined),
    );

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        ...filteredQuery,
      },
      queryParamsHandling: 'merge',
      fragment: 'products',
    });

    this.products$ = this.productService.getProducts(newQuery);
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const category = this.optionsService.currentCategory();
        const subCategory = this.optionsService.currentSubCategory();
        const priceFilter = this.optionsService.currentPriceFilter();
        const page = this.optionsService.currentPage();
        const sort = this.optionsService.currentSort();
        this.products$ = this.productService.getProducts({
          categoryId: category?.id,
          subCategoryId: subCategory?.id,
          page,
          minPrice: priceFilter?.min,
          maxPrice: priceFilter?.max,
          sortBy: sort!,
        });
        this.cdr.detectChanges();
      });
  }

  pageChange(event: any) {
    const paginationConfig = this.productService.paginationConfig;
    const newPaginationConfig = { ...paginationConfig(), currentPage: event };
    this.productService.paginationConfig.set(
      newPaginationConfig as PaginationInstance,
    );
    this.optionsService.currentPage.set(event);
    const savedQuery: ISavedProductOptionQueries = JSON.parse(
      sessionStorage.getItem('hshs82haa02sshs92s')!,
    );
    sessionStorage.setItem(
      'hshs82haa02sshs92s',
      JSON.stringify({ ...savedQuery, page: event }),
    );
    this.productService.productSignal.set(null);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: event,
      },
      queryParamsHandling: 'merge',
      fragment: 'products',
    });
    setTimeout(() => {
      window.scrollTo({
        top: 470,
        behavior: 'smooth',
      });
    }, 100);
  }

  checkNumberOfFiltersApplied(): number {
    return this.optionsService.checkNumberOfFiltersApplied();
  }

  onOpenMobileFilter() {
    this.layoutService.mobileFilterOpened.set(
      !this.layoutService.mobileFilterOpened(),
    );
  }
}
