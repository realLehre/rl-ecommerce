import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
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
  ngOnInit() {
    const savedQuery: ISavedProductOptionQueries = JSON.parse(
      sessionStorage.getItem('hshs82haa02sshs92s')!,
    );

    const newQuery = {
      categoryId: savedQuery?.category?.id,
      subCategoryId: savedQuery?.subCategory?.id,
      page: savedQuery?.page,
    };

    this.products$ = this.productService.getProducts(newQuery);
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const category = this.optionsService.currentCategory();
        const subCategory = this.optionsService.currentSubCategory();
        const page = this.optionsService.currentPage();
        this.products$ = this.productService.getProducts({
          categoryId: category?.id,
          subCategoryId: subCategory?.id,
          page,
        });
        console.log(1);
        this.cdr.detectChanges();
      });
  }

  pageChange(event: any) {
    const paginationConfig = this.productService.paginationConfig;
    const newPaginationConfig = { ...paginationConfig(), currentPage: event };
    this.productService.paginationConfig.set(
      newPaginationConfig as PaginationInstance,
    );
    console.log(newPaginationConfig);
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
      fragment: 't',
    });
    setTimeout(() => {
      window.scrollTo({
        top: 500,
        behavior: 'smooth',
      });
    }, 100);
  }

  onOpenMobileFilter() {
    this.layoutService.mobileFilterOpened.set(true);
  }
}
