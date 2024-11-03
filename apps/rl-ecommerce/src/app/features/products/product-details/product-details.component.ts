import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import { ProductsService } from '../services/products.service';
import { filter, Observable, of } from 'rxjs';
import { IProduct } from '../model/product.interface';
import { AsyncPipe, CurrencyPipe, NgClass, NgStyle } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { CartService } from '../../../shared/services/cart.service';
import { UserAccountService } from '../../user/user-account/services/user-account.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ProductReviewsComponent } from './product-reviews/product-reviews.component';
import { LargeReviewsComponent } from './large-reviews/large-reviews.component';
import { ReviewService } from '../../../shared/services/review.service';

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
    AsyncPipe,
    SkeletonModule,
    CurrencyPipe,
    NgClass,
    ProductReviewsComponent,
    LargeReviewsComponent,
    NgStyle,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private productService = inject(ProductsService);
  private cartService = inject(CartService);
  private userService = inject(UserAccountService);
  private reviewService = inject(ReviewService);
  private toast = inject(ToastService);
  activeProduct = this.productService.activeProduct;
  product$!: Observable<IProduct>;
  similarProducts!: Observable<IProduct[]>;
  quantity: number = 1;
  isLoading: boolean = false;
  isCollapsed = signal(true);
  limit = 200;
  cdr = inject(ChangeDetectorRef);
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
        ?.cartItems?.find(
          (cartItem) =>
            cartItem.productId === this.route.snapshot.queryParams['id'],
        );
    }
    return;
  });
  isUpdatingCart = signal(false);

  ngOnInit() {
    this.productId = this.route.snapshot.queryParams['id'];
    const isShowingReviews = this.route.snapshot.queryParams['reviews'];
    if (isShowingReviews) {
      this.reviewService.seeingFullReview.set(true);
    }
    this.product$ = this.productService.getProductById(this.productId);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.productId = this.route.snapshot.queryParams['id'];
        this.product$ = this.productService.getProductById(this.productId);
      });

    this.cdr.detectChanges();
  }

  onAddToCart(product: IProduct) {
    this.isAddingToCart.set(true);

    this.cartService
      .addToCart({
        product: product,
        unit: this.quantity,
      })!
      .subscribe({
        next: (res) => {
          this.isAddingToCart.set(false);
          const cartTotal = this.cartService.cartTotal;

          this.cartService.cartTotal.set(cartTotal()! + 1);

          this.cartService.cartSignal.set(null);
          this.cartService.getCart().subscribe();
          this.toast.showToast({
            type: 'success',
            message: `${product.name} added to cart!`,
          });
        },
        error: (err) => {
          this.isAddingToCart.set(false);
          this.toast.showToast({
            type: 'error',
            message: err.error.message,
          });
        },
      });
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
          itemId: product.id,
          unit: this.quantity,
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
          },
          error: (err) => {
            this.isUpdatingCart.set(false);
          },
        });
    }
  }

  averageRating(): number {
    if (this.activeProduct()?.ratings) {
      const totalRating = this.activeProduct()?.ratings.reduce(
        (acc: number, rating: any) => acc + rating.rating,
        0,
      );
      return totalRating! / this.activeProduct()?.ratings.length! || 0;
    } else {
      return 0;
    }
  }

  getStarWidth(starIndex: number): string {
    const fullStars = Math.floor(this.averageRating());
    const partialFill = (this.averageRating() % 1) * 100;

    if (starIndex < fullStars) {
      return '100%';
    } else if (starIndex === fullStars) {
      return `${partialFill}%`;
    } else {
      return '0%';
    }
  }
}
