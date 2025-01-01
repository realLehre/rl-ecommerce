import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { ProductDetailsImagesComponent } from './product-details-images/product-details-images.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { RecommendedProductsComponent } from '../recommended-products/recommended-products.component';
import { ProductQuantityComponent } from '../../../shared/components/product-quantity/product-quantity.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { IProduct } from '../model/product.interface';
import { CurrencyPipe, NgClass, NgStyle } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { CartService } from '../../../shared/services/cart.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ProductReviewsComponent } from './product-reviews/product-reviews.component';
import { LargeReviewsComponent } from './large-reviews/large-reviews.component';
import { ReviewService } from '../../../shared/services/review.service';
import { PricePercentageDecreasePipe } from '../../../shared/pipes/price-percentage-decrease.pipe';
import { ICart, ICartItems } from '../../../shared/models/cart.interface';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../../auth/services/auth.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { addToCart } from '../../../state/cart/cart.actions';

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
  private authService = inject(AuthService);
  private store = inject(Store);
  activeProduct = this.productService.activeProduct;
  quantity: number = 1;
  isCollapsed = signal(true);
  limit = 200;
  isAddingToCart = signal(false);
  productId!: string;
  isShowingFullReview = this.reviewService.seeingFullReview;
  stars = signal(
    Array.from({ length: 5 }, (_, i) => ({ star: i + 1, active: false })),
  );
  productInCart = computed(() => {
    if (this.cartService.cartSignal()) {
      return this.cartService
        .cartSignal()
        ?.cartItems?.find((cartItem) => cartItem.productId === this.id());
    }
    return;
  });
  id = signal(this.route.snapshot.queryParams['id']);
  isUpdatingCart = signal(false);
  isLoading = signal(true);
  isError = signal(false);
  errorMessage = signal(undefined);
  refreshTrigger = signal(0);
  refresh = computed(() => ({
    id: this.id(),
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
    this.isAddingToCart.set(true);
    this.store.dispatch(addToCart({ product: product, unit: this.quantity }));
    // this.cartService
    //   .addToCart({
    //     product: product,
    //     unit: this.quantity,
    //   })!
    //   .subscribe({
    //     next: (res) => {
    //       this.isAddingToCart.set(false);
    //       const cartTotal = this.cartService.cartTotal;
    //
    //       this.cartService.cartTotal.set(cartTotal()! + 1);
    //
    //       //   this.cartService.cartSignal.set(null);
    //       //
    //       // this.cartService.getCart().subscribe();
    //
    //       const cart = this.cartService.cartSignal() || ({} as ICart);
    //       this.cartService.cartSignal.set(null);
    //       this.cartService.getCart().subscribe();
    //       const newCartItem = {
    //         ...res,
    //         product: this.activeProduct() as IProduct,
    //       };
    //       this.cartService.cartSignal.set({
    //         ...this.cartService.cartSignal()!,
    //         cartItems: Array.isArray(cart?.cartItems!)
    //           ? [...cart?.cartItems!, newCartItem as any]
    //           : [newCartItem],
    //       });
    //
    //       if (!this.authService.user()) {
    //         this.cartService.guestCart.cartItems?.push(res as ICartItems);
    //         localStorage.setItem(
    //           this.cartService.STORAGE_KEY,
    //           JSON.stringify(this.cartService.guestCart),
    //         );
    //         this.cartService.cartTotal.set(cartTotal()! + 1);
    //       }
    //
    //       this.toast.showToast({
    //         type: 'success',
    //         message: `${product.name} added to cart!`,
    //       });
    //     },
    //     error: (err) => {
    //       this.isAddingToCart.set(false);
    //       this.toast.showToast({
    //         type: 'error',
    //         message: err.error.message,
    //       });
    //     },
    //   });
  }

  toggleCollapse() {
    this.isCollapsed.set(!this.isCollapsed());
  }

  onAdjustQuantity(qty: number, product: IProduct) {
    this.quantity = qty;
    if (this.productInCart()) {
      this.isUpdatingCart.set(true);

      this.cartService
        .updateCartItem({
          itemId: this.productInCart()?.id!,
          unit: qty,
          productPrice: product.price!,
        })
        .subscribe({
          next: (res) => {
            this.isUpdatingCart.set(false);
            const currentCart = this.cartService.cartSignal();
            if (currentCart) {
              const updatedItems = currentCart.cartItems.map((cartItem) => {
                if (cartItem.id === this.productInCart()?.id!) {
                  return {
                    ...cartItem,
                    unit: qty,
                    total: qty * cartItem.product.price,
                  };
                }
                return cartItem;
              });

              const newCart = { ...currentCart, cartItems: updatedItems };

              // this.cart$ = of(newCart);
              // this.cart.set(newCart);
              this.cartService.cartSignal.set(newCart);
              localStorage.setItem(
                this.cartService.CART_KEY,
                JSON.stringify(newCart),
              );
            }

            this.toast.showToast({
              type: 'success',
              message: product.name + ' ' + 'quantity adjusted!',
            });
          },
          error: (err) => {
            this.isUpdatingCart.set(false);
            this.toast.showToast({
              type: 'error',
              message: err.error.message,
            });
          },
        });
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
