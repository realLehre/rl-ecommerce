import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
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
  cart = this.cartService.cartSignal as WritableSignal<ICart>;
  quantity: number = 1;
  isUpdating = signal<boolean[]>([false]);
  showDeleteDialog = signal(false);
  activeCartItem!: ICartItems;
  isLoading = signal(false);
  ngOnInit() {
    if (!this.cart()) {
      const cartData: Partial<ICart> = {
        cartItems: [],
      };

      this.cart.set(cartData as ICart);
    }
  }

  onAdjustQuantity(qty: number, item: ICartItems, idx: number) {
    let loadings = [...this.isUpdating()];
    loadings[idx] = true;
    this.isUpdating.set(loadings);
    this.quantity = qty;
    this.store.dispatch(
      updateCartItem({
        itemId: item.id,
        unit: this.quantity,
        productPrice: item.product.price,
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
    this.isLoading.set(true);
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
