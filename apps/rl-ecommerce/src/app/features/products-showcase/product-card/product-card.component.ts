import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { CurrencyPipe, NgClass, NgStyle } from '@angular/common';
import { Router } from '@angular/router';
import { IProduct } from '../../products/model/product.interface';
import { ProductsService } from '../../products/services/products.service';
import { SkeletonModule } from 'primeng/skeleton';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { CartService } from '../../../shared/services/cart.service';
import { ToastService } from '../../../shared/services/toast.service';
import { UserAccountService } from '../../user/user-account/services/user-account.service';
import { ReviewService } from '../../../shared/services/review.service';
import { ProductQuantityComponent } from '../../../shared/components/product-quantity/product-quantity.component';
import { ICart, ICartItems } from '../../../shared/models/cart.interface';
import { PricePercentageDecreasePipe } from '../../../shared/pipes/price-percentage-decrease.pipe';
import { ImagePreloadDirective } from '../../../shared/directives/image-preload.directive';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CurrencyPipe,
    SkeletonModule,
    LoaderComponent,
    NgClass,
    NgStyle,
    ProductQuantityComponent,
    PricePercentageDecreasePipe,
    ImagePreloadDirective,
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  router = inject(Router);
  private productService = inject(ProductsService);
  private toast = inject(ToastService);
  private cartService = inject(CartService);
  private userService = inject(UserAccountService);
  private reviewService = inject(ReviewService);
  user = this.userService.user;
  product = input.required<IProduct>();
  isAddingToCart = signal(false);
  stars = signal(
    Array.from({ length: 5 }, (_, i) => ({ star: i + 1, active: false })),
  );
  quantity: number = 1;
  isUpdatingCart = signal(false);

  productInCart = computed(() => {
    if (this.cartService.cartSignal()) {
      return this.cartService
        .cartSignal()
        ?.cartItems?.find(
          (cartItem) => cartItem.productId === this.product().id,
        );
    }
    return;
  });

  onViewDetails(product: IProduct) {
    this.productService.activeProduct.set(product);
    this.reviewService.seeingFullReview.set(false);
    this.router.navigate(
      ['/product/' + this.productService.createSlug(product.name)],
      {
        queryParams: { id: product.id },
      },
    );
  }

  onAddToCart() {
    if (this.user()) {
      this.isAddingToCart.set(true);
    }
    this.cartService
      .addToCart({
        product: this.product(),
        unit: 1,
      })
      .subscribe({
        next: (res) => {
          this.isAddingToCart.set(false);
          const cartTotal = this.cartService.cartTotal;

          this.cartService.cartTotal.set(cartTotal()! + 1);

          const cart = { ...this.cartService.cartSignal() } || ({} as ICart);
          this.cartService.cartSignal.set(null);
          this.cartService.getCart().subscribe();
          const newCartItem = { ...res, product: this.product() as IProduct };
          this.cartService.cartSignal.set({
            ...this.cartService.cartSignal()!,
            cartItems: Array.isArray(cart?.cartItems!)
              ? [...cart?.cartItems!, newCartItem as any]
              : [newCartItem],
          });
          if (!this.user()) {
            this.cartService.guestCart.cartItems?.push(res as ICartItems);
            localStorage.setItem(
              this.cartService.STORAGE_KEY,
              JSON.stringify(this.cartService.guestCart),
            );
            this.cartService.cartTotal.set(cartTotal()! + 1);
          }
          this.toast.showToast({
            type: 'success',
            message: `${this.product().name} added to cart!`,
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

  onAdjustQuantity(qty: number) {
    this.isUpdatingCart.set(true);
    this.quantity = qty;

    this.cartService
      .updateCartItem({
        itemId: this.productInCart()?.id!,
        unit: this.quantity,
        productPrice: this.product()?.price!,
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

            this.cartService.cartSignal.set(newCart);

            localStorage.setItem(
              this.cartService.CART_KEY,
              JSON.stringify(newCart),
            );
          }
          this.toast.showToast({
            type: 'success',
            message: this.product()?.name + ' ' + 'quantity adjusted!',
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

  averageRating(): number {
    const totalRating = this.product().ratings.reduce(
      (acc: number, rating: any) => acc + rating.rating,
      0,
    );
    return totalRating / this.product().ratings.length || 0;
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
