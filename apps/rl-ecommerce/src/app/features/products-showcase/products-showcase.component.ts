import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Signal,
  signal,
} from '@angular/core';
import { ProductCardComponent } from './product-card/product-card.component';
import { MobileFiltersComponent } from '../product-options/mobile-filters/mobile-filters.component';
import { LayoutService } from '../../shared/services/layout.service';
import { NgClass } from '@angular/common';
import { ProductsService } from '../products/services/products.service';
import { SkeletonModule } from 'primeng/skeleton';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { ProductOptionsService } from '../product-options/services/product-options.service';
import { IProductResponse } from '../products/model/product.interface';
import { NgxPaginationModule } from 'ngx-pagination';
import { ItemsShowingPipe } from '../../shared/pipes/items-showing.pipe';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-products-showcase',
  standalone: true,
  imports: [
    ProductCardComponent,
    MobileFiltersComponent,
    NgClass,
    SkeletonModule,
    NgxPaginationModule,
    ItemsShowingPipe,
  ],
  templateUrl: './products-showcase.component.html',
  styleUrl: './products-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsShowcaseComponent {
  private layoutService = inject(LayoutService);
  private productService = inject(ProductsService);
  private optionsService = inject(ProductOptionsService);
  private toast = inject(ToastService);
  isMobileFilterOpened = this.layoutService.mobileFilterOpened;
  config = this.productService.paginationConfig;
  numberOfFilters = this.optionsService.numberOfFilters;
  isLoading = signal(true);
  isError = signal(false);
  refreshTrigger = signal(0);
  refresh = computed(() => ({
    filter: this.optionsService.filter(),
    refresh: this.refreshTrigger(),
  }));
  products$: Observable<IProductResponse | any> = toObservable(
    this.refresh,
  ).pipe(
    tap(() => this.isLoading.set(true)),
    switchMap(({ filter }) =>
      this.productService.getProducts(filter).pipe(
        catchError((err) => {
          this.toast.showToast({
            type: 'error',
            message: err.error.message,
          });
          this.isError.set(true);
          this.isLoading.set(false);
          return of(null);
        }),
      ),
    ),
    tap(() => this.isLoading.set(false)),
  );
  productsData: Signal<IProductResponse> = toSignal(this.products$);
  loaders = Array.from({ length: 15 });

  onRetryLoad() {
    this.refreshTrigger.update((count) => count + 1);
  }

  pageChange(event: any) {
    this.optionsService.currentPage.set(event);
    this.optionsService.setDataAndRoute();
    this.productService.productSignal.set(null);
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 470,
        behavior: 'smooth',
      });
    });
  }

  onOpenMobileFilter() {
    this.layoutService.mobileFilterOpened.set(
      !this.layoutService.mobileFilterOpened(),
    );
  }
}
