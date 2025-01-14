import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { ProductDetailsImagesComponent } from './product-details-images/product-details-images.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { RecommendedProductsComponent } from '../recommended-products/recommended-products.component';
import { ProductQuantityComponent } from '../../../shared/components/product-quantity/product-quantity.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { IProduct } from '../model/product.interface';
import { CurrencyPipe, NgClass, NgStyle } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { CartService } from '../../../shared/services/cart.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ProductReviewsComponent } from './product-reviews/product-reviews.component';
import { LargeReviewsComponent } from './large-reviews/large-reviews.component';
import { ReviewService } from '../../../shared/services/review.service';
import { PricePercentageDecreasePipe } from '../../../shared/pipes/price-percentage-decrease.pipe';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import {
  addToCart,
  loadCart,
  updateCartItem,
} from '../../../state/cart/cart.actions';
import { selectCart, selectCartLoadingOperations } from '../../../state/state';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    ProductDetailsImagesComponent,
    LoaderComponent,
    RecommendedProductsComponent,
    ProductQuantityComponent,
    RouterLink,
    SkeletonModule,
    CurrencyPipe,
    NgClass,
    ProductReviewsComponent,
    LargeReviewsComponent,
    NgStyle,
    PricePercentageDecreasePipe,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductsService);
  private cartService = inject(CartService);
  private reviewService = inject(ReviewService);
  private toast = inject(ToastService);
  private sanitizer = inject(DomSanitizer);
  private store = inject(Store);
  activeProduct = this.productService.activeProduct;
  quantity: number = 1;
  isCollapsed = signal(true);
  limit = 200;
  isShowingFullReview = this.reviewService.seeingFullReview;
  stars = signal(
    Array.from({ length: 5 }, (_, i) => ({ star: i + 1, active: false })),
  );
  cart = toSignal(this.store.select(selectCart));
  productInCart = computed(() => {
    return this.cart()?.cartItems?.find(
      (cartItem) => cartItem.productId === this.id(),
    );
  });
  id = signal(this.route.snapshot.queryParams['id']);
  productId = computed(() =>
    this.activeProduct() ? this.activeProduct()?.id : this.id(),
  );
  isLoading = signal(true);
  isError = signal(false);
  errorMessage = signal(undefined);
  refreshTrigger = signal(0);
  refresh = computed(() => ({
    id: this.productId(),
    refresh: this.refreshTrigger(),
  }));
  productDetails$: Observable<IProduct | any> = toObservable(this.refresh).pipe(
    tap(() => this.isLoading.set(true)),
    switchMap(({ id }) =>
      this.productService.getProductById(id).pipe(
        catchError((err: any) => {
          this.toast.showToast({ type: 'error', message: err.error.message });
          this.isError.set(true);
          this.errorMessage.set(err.error.message);
          return of(null);
        }),
      ),
    ),
    tap((res) => {
      this.isLoading.set(false);
      this.productService.activeProduct.set(res);
    }),
  );
  productDetailsData = toSignal(this.productDetails$);
  isAddingToCart = toSignal(
    this.store.select(selectCartLoadingOperations).pipe(
      tap((res) => {
        if (res.error) {
          this.toast.showToast({
            type: 'error',
            message: res.error,
          });
        } else if (res.add?.status === 'success') {
          this.toast.showToast({
            type: 'success',
            message: `${this.productDetailsData()?.name} added to cart!`,
          });
        }
      }),
      map((operation) =>
        this.id() == operation.productId
          ? operation.error
            ? false
            : operation.add?.loading
          : null,
      ),
    ),
  );
  updateError = signal(false);
  isUpdatingCart: Signal<boolean | any> = toSignal(
    this.store.select(selectCartLoadingOperations).pipe(
      tap((res) => {
        if (res.error && res.update.status == 'error') {
          this.toast.showToast({
            type: 'error',
            message: res.error,
          });
        } else if (res.update?.status === 'success') {
          this.toast.showToast({
            type: 'success',
            message: 'Quantity adjusted',
          });
        }
      }),
      map((operation) => {
        if (this.id() == operation.productId) {
          if (operation.error) {
            this.updateError.set(true);
          } else {
            this.updateError.set(false);
          }

          return operation.error ? false : operation.update?.loading;
        }
        return;
      }),
    ),
  );

  ngOnInit() {
    const isShowingReviews = this.route.snapshot.queryParams['reviews'];
    if (isShowingReviews) {
      this.reviewService.seeingFullReview.set(true);
    }
  }

  onViewDetails() {
    this.refreshTrigger.update((count) => count + 1);
    this.id.set(this.productService.activeProduct()?.id);
  }

  onAddToCart(product: IProduct) {
    if (
      !this.cartService.user() &&
      !this.cartService.guestCart.hasOwnProperty('id')
    ) {
      this.cartService.createGuestCart();
      this.store.dispatch(loadCart());
    }
    this.store.dispatch(addToCart({ product: product, unit: this.quantity }));
  }

  toggleCollapse() {
    this.isCollapsed.set(!this.isCollapsed());
  }

  onAdjustQuantity(qty: number, product: IProduct) {
    this.quantity = qty;
    if (this.productInCart()) {
      this.store.dispatch(
        updateCartItem({
          itemId: this.productInCart()?.id!,
          unit: this.quantity,
          product: product,
        }),
      );
    }
  }

  sanitizedDescription(desc: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(desc);
  }

  stripedDescription(desc: string) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = desc;
    return tempDiv.textContent || tempDiv.innerText || '';
  }

  getStarWidth(starIndex: number): string {
    return this.productService.getStarWidth(starIndex);
  }
}
