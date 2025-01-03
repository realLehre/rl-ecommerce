import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { Router, RouterLink } from '@angular/router';
import { EmptyCartComponent } from './empty-cart/empty-cart.component';
import { SkeletonModule } from 'primeng/skeleton';
import { CurrencyPipe } from '@angular/common';
import { ProductQuantityComponent } from '../../shared/components/product-quantity/product-quantity.component';
import { CartService } from '../../shared/services/cart.service';
import {
  ICart,
  ICartItemProduct,
  ICartItems,
} from '../../shared/models/cart.interface';
import { SubtotalPipe } from '../../shared/pipes/subtotal.pipe';
import { DialogModule } from 'primeng/dialog';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { PrimeTemplate } from 'primeng/api';
import { ProductsService } from '../products/services/products.service';
import { IProduct } from '../products/model/product.interface';
import { ToastService } from '../../shared/services/toast.service';
import { Store } from '@ngrx/store';
import {
  removeItemFromCart,
  updateCartItem,
} from '../../state/cart/cart.actions';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  selectCart,
  selectCartLoadingOperations,
  selectCartState,
} from '../../state/state';
import { map, tap } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    RouterLink,
    EmptyCartComponent,
    SkeletonModule,
    CurrencyPipe,
    ProductQuantityComponent,
    SubtotalPipe,
    DialogModule,
    LoaderComponent,
    PrimeTemplate,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private productService = inject(ProductsService);
  private router = inject(Router);
  private toast = inject(ToastService);
  private store = inject(Store);
  cartState = toSignal(this.store.select(selectCartState));
  quantity: number = 1;
  // isUpdating = signal<boolean[]>([false]);
  isUpdatingIndex = signal<number | null>(null);
  showDeleteDialog = signal(false);
  activeCartItem!: ICartItems;
  private lastToastStatus: string | null = null;

  isLoading = toSignal(
    this.store.select(selectCartLoadingOperations).pipe(
      tap((res) => {
        if (res.error) {
          this.toast.showToast({
            type: 'error',
            message: res.error,
          });
        } else if (res.delete?.status === 'success') {
          this.toast.showToast({
            type: 'success',
            message:
              this.activeCartItem.product.name + ' ' + 'deleted from cart!',
          });
          this.showDeleteDialog.set(false);
        }
      }),
      map((operation) => (operation.error ? false : operation.delete?.loading)),
    ),
  );
  updateError = signal(false);
  isUpdating: Signal<boolean[] | any> = toSignal(
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
        let loadingStates = [];
        loadingStates[this.isUpdatingIndex()!] = true;

        if (operation.error) {
          loadingStates[this.isUpdatingIndex()!] = false;
          this.updateError.set(true);
        } else {
          loadingStates[this.isUpdatingIndex()!] = operation.update?.loading;
          this.updateError.set(false);
        }

        return loadingStates;
      }),
    ),
  );
  ngOnInit() {
    // if (!this.cart()) {
    //   const cartData: Partial<ICart> = {
    //     cartItems: [],
    //   };
    //
    //   this.cart.set(cartData as ICart);
    // }
  }

  onAdjustQuantity(qty: number, item: ICartItems, idx: number) {
    this.isUpdatingIndex.set(idx);
    this.quantity = qty;
    this.store.dispatch(
      updateCartItem({
        itemId: item.id,
        unit: this.quantity,
        product: item.product as IProduct,
      }),
    );
    // this.cartService
    //   .updateCartItem({
    //     itemId: item.id,
    //     unit: this.quantity,
    //     productPrice: item.product.price,
    //   })
    //   .subscribe({
    //     next: (res) => {
    //       loadings[idx] = false;
    //       this.isUpdating.set([...loadings]);
    //       const currentCart = this.cartService.cartSignal();
    //       if (currentCart) {
    //         const updatedItems = currentCart.cartItems.map((cartItem) => {
    //           if (cartItem.id === item.id) {
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
    //         // this.cart$ = of(newCart);
    //         this.cart.set(newCart);
    //         this.cartService.cartSignal.set(newCart);
    //         localStorage.setItem(
    //           this.cartService.CART_KEY,
    //           JSON.stringify(newCart),
    //         );
    //       }
    //       this.toast.showToast({
    //         type: 'success',
    //         message: item.product.name + ' ' + 'quantity adjusted!',
    //       });
    //     },
    //     error: (err) => {
    //       loadings[idx] = false;
    //       this.isUpdating.set([...loadings]);
    //       this.toast.showToast({
    //         type: 'error',
    //         message: err.error.message,
    //       });
    //     },
    //   });
  }

  onDeleteDialogAction(action: string, item?: ICartItems) {
    if (item) this.activeCartItem = item;
    action === 'open'
      ? this.showDeleteDialog.set(true)
      : this.showDeleteDialog.set(false);
  }

  onDeleteCartItem() {
    // this.isLoading.set(true);
    this.store.dispatch(removeItemFromCart({ id: this.activeCartItem?.id }));
    // this.cartService.deleteCartItem(this.activeCartItem?.id).subscribe({
    //   next: (res) => {
    //     this.isLoading.set(false);
    //     this.showDeleteDialog.set(false);
    //     const cart = this.cartService.cartSignal();
    //     if (cart) {
    //       const cartItems = cart?.cartItems.filter(
    //         (item) => item.id !== this.activeCartItem?.id,
    //       );
    //
    //       const newCart = { ...cart, cartItems };
    //
    //       // this.cart$ = of(newCart);
    //       this.cart.set(newCart);
    //       this.cartService.cartSignal.set(newCart);
    //       this.cartService.cartTotal.set(cartItems.length);
    //       localStorage.setItem(
    //         this.cartService.CART_KEY,
    //         JSON.stringify(newCart),
    //       );
    //     }
    //     this.toast.showToast({
    //       type: 'success',
    //       message:
    //         this.activeCartItem.product.name + ' ' + 'deleted from cart!',
    //     });
    //   },
    //   error: (err) => {
    //     this.isLoading.set(false);
    //     this.toast.showToast({
    //       type: 'error',
    //       message: err.error.message,
    //     });
    //   },
    // });
  }

  onViewProduct(product: ICartItemProduct) {
    this.productService.activeProduct.set(product as IProduct);
    this.router.navigate(
      ['/product/' + this.productService.createSlug(product.name)],
      {
        queryParams: { id: product.id },
      },
    );
  }
}
