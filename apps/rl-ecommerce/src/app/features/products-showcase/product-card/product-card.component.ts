import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
  Signal,
  signal,
} from '@angular/core';
import { CurrencyPipe, NgOptimizedImage, NgStyle } from '@angular/common';
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
import { addToCart, updateCartItem } from '../../../state/cart/cart.actions';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectCart, selectCartLoadingOperations } from '../../../state/state';
import { map, tap } from 'rxjs';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CurrencyPipe,
    SkeletonModule,
    LoaderComponent,
    NgStyle,
    ProductQuantityComponent,
    PricePercentageDecreasePipe,
    NgOptimizedImage,
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent implements OnInit {
  router = inject(Router);
  private productService = inject(ProductsService);
  private toast = inject(ToastService);
  private cartService = inject(CartService);
  private userService = inject(UserAccountService);
  private reviewService = inject(ReviewService);
  private store = inject(Store);
  user = this.userService.user;
  product = input.required<IProduct>();
  productId = signal('');
  // isAddingToCart = signal(false);
  stars = signal(
    Array.from({ length: 5 }, (_, i) => ({ star: i + 1, active: false })),
  );
  quantity: number = 1;
  // isUpdatingCart = signal(false);
  cart = toSignal(this.store.select(selectCart));
  productInCart = computed(() => {
    return this.cart()?.cartItems?.find(
      (cartItem) => cartItem.productId === this.product().id,
    );
  });
  seeDetails = output();

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
            message: `${this.product()?.name} added to cart!`,
          });
        }
      }),
      map((operation) =>
        this.productId() == operation.productId
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
        if (this.productId() == operation.productId) {
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
    this.productId.set(this.product().id);
  }

  onViewDetails(product: IProduct) {
    this.productService.activeProduct.set(product);
    this.reviewService.seeingFullReview.set(false);
    this.seeDetails.emit();
    this.router.navigate(
      ['/product/' + this.productService.createSlug(product.name)],
      {
        queryParams: { id: product.id },
      },
    );
  }

  onAddToCart() {
    this.store.dispatch(
      addToCart({ product: this.product(), unit: this.quantity }),
    );
    // if (this.user()) {
    //   this.isAddingToCart.set(true);
    // }
    // this.cartService
    //   .addToCart({
    //     product: this.product(),
    //     unit: 1,
    //   })
    //   .subscribe({
    //     next: (res) => {
    //       this.isAddingToCart.set(false);
    //       const cartTotal = this.cartService.cartTotal;
    //
    //       this.cartService.cartTotal.set(cartTotal()! + 1);
    //
    //       const cart = { ...this.cartService.cartSignal() } || ({} as ICart);
    //       this.cartService.cartSignal.set(null);
    //       this.cartService.getCart().subscribe();
    //       const newCartItem = { ...res, product: this.product() as IProduct };
    //       this.cartService.cartSignal.set({
    //         ...this.cartService.cartSignal()!,
    //         cartItems: Array.isArray(cart?.cartItems!)
    //           ? [...cart?.cartItems!, newCartItem as any]
    //           : [newCartItem],
    //       });
    //       if (!this.user()) {
    //         this.cartService.guestCart.cartItems?.push(res as ICartItems);
    //         localStorage.setItem(
    //           this.cartService.STORAGE_KEY,
    //           JSON.stringify(this.cartService.guestCart),
    //         );
    //         this.cartService.cartTotal.set(cartTotal()! + 1);
    //       }
    //       this.toast.showToast({
    //         type: 'success',
    //         message: `${this.product().name} added to cart!`,
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

  onAdjustQuantity(qty: number) {
    this.quantity = qty;
    this.store.dispatch(
      updateCartItem({
        itemId: this.productInCart()?.id!,
        unit: this.quantity,
        product: this.product(),
      }),
    );
    // this.cartService
    //   .updateCartItem({
    //     itemId: this.productInCart()?.id!,
    //     unit: this.quantity,
    //     productPrice: this.product()?.price!,
    //   })
    //   .subscribe({
    //     next: () => {
    //       this.isUpdatingCart.set(false);
    //       const currentCart = this.cartService.cartSignal();
    //       if (currentCart) {
    //         const updatedItems = currentCart.cartItems.map((cartItem) => {
    //           if (cartItem.id === this.productInCart()?.id!) {
    //             return {
    //               ...cartItem,
    //               unit: qty,
    //               total: qty * cartItem.product.price,
    //             };
    //           }
    //           return cartItem;
    //         });
    //
    //         const newCart = { ...currentCart, cartItems: updatedItems };
    //
    //         this.cartService.cartSignal.set(newCart);
    //
    //         localStorage.setItem(
    //           this.cartService.CART_KEY,
    //           JSON.stringify(newCart),
    //         );
    //       }
    //       this.toast.showToast({
    //         type: 'success',
    //         message: this.product()?.name + ' ' + 'quantity adjusted!',
    //       });
    //     },
    //     error: (err) => {
    //       this.isUpdatingCart.set(false);
    //       this.toast.showToast({
    //         type: 'error',
    //         message: err.error.message,
    //       });
    //     },
    //   });
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
