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
import { CurrencyPipe, NgStyle } from '@angular/common';
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
import { PricePercentageDecreasePipe } from '../../../shared/pipes/price-percentage-decrease.pipe';
import {
  addToCart,
  loadCart,
  updateCartItem,
} from '../../../state/cart/cart.actions';
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
  stars = signal(
    Array.from({ length: 5 }, (_, i) => ({ star: i + 1, active: false })),
  );
  quantity: number = 1;
  cart = toSignal(this.store.select(selectCart));
  productInCart = computed(() => {
    return this.cart()?.cartItems?.find(
      (cartItem) => cartItem.productId === this.product().id,
    );
  });
  seeDetails = output();
  ProductCard = '';

  isAddingToCart = toSignal(
    this.store.select(selectCartLoadingOperations).pipe(
      tap((res) => {
        if (this.productId() == res.productId) {
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
  averageRating = computed(() => {
    const totalRating = this.product().ratings.reduce(
      (acc: number, rating: any) => acc + rating.rating,
      0,
    );
    return totalRating / this.product().ratings.length || 0;
  });

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
    if (
      !this.cartService.user() &&
      !this.cartService.guestCart.hasOwnProperty('id')
    ) {
      this.cartService.createGuestCart();
      this.store.dispatch(loadCart());
    }
    this.store.dispatch(
      addToCart({ product: this.product(), unit: this.quantity }),
    );
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
  }

  getStarWidth(starIndex: number): string {
    return this.productService.getProductCartStarWidth(
      starIndex,
      this.averageRating(),
    );
  }
}
