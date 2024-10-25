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
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ProductQuantityComponent } from '../../shared/components/product-quantity/product-quantity.component';
import { CartService } from '../../shared/services/cart.service';
import {
  ICart,
  ICartItemProduct,
  ICartItems,
} from '../../shared/models/cart.interface';
import { Observable, of } from 'rxjs';
import { SubtotalPipe } from '../../shared/pipes/subtotal.pipe';
import { DialogModule } from 'primeng/dialog';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { PrimeTemplate } from 'primeng/api';
import { ProductsService } from '../products/services/products.service';
import { IProduct } from '../products/model/product.interface';

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
    AsyncPipe,
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
  // cart$ = this.cartService.getCart();
  cart$!: Observable<ICart>;
  cart = this.cartService.cartSignal as WritableSignal<ICart>;
  quantity: number = 1;
  isUpdating = signal<boolean[]>([false]);
  showDeleteDialog = signal(false);
  activeCartItem!: ICartItems;
  isLoading = signal(false);
  ngOnInit() {}

  onAdjustQuantity(qty: number, item: ICartItems, idx: number) {
    let loadings = [...this.isUpdating()];
    loadings[idx] = true;
    this.isUpdating.set(loadings);
    this.quantity = qty;

    this.cartService
      .updateCartItem({
        itemId: item.id,
        unit: this.quantity,
        productPrice: item.product.price,
      })
      .subscribe({
        next: (res) => {
          loadings[idx] = false;
          this.isUpdating.set([...loadings]);
          const currentCart = this.cartService.cartSignal();
          if (currentCart) {
            const updatedItems = currentCart.cartItems.map((cartItem) => {
              if (cartItem.id === item.id) {
                return {
                  ...cartItem,
                  unit: qty,
                  total: qty * cartItem.product.price,
                };
              }
              return cartItem;
            });

            this.cart$ = of({ ...currentCart, cartItems: updatedItems });
            this.cart.set({ ...currentCart, cartItems: updatedItems });
            this.cartService.cartSignal.set({
              ...currentCart,
              cartItems: updatedItems,
            });
          }
        },
        error: (err) => {
          loadings[idx] = false;
          this.isUpdating.set([...loadings]);
        },
      });
  }

  onDeleteDialogAction(action: string, item?: ICartItems) {
    if (item) this.activeCartItem = item;
    action === 'open'
      ? this.showDeleteDialog.set(true)
      : this.showDeleteDialog.set(false);
  }

  onDeleteCartItem() {
    this.isLoading.set(true);
    this.cartService.deleteCartItem(this.activeCartItem?.id).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.showDeleteDialog.set(false);
        const cart = this.cartService.cartSignal();
        if (cart) {
          const cartItems = cart?.cartItems.filter(
            (item) => item.id !== this.activeCartItem?.id,
          );

          this.cart$ = of({ ...cart, cartItems });
          this.cart.set({ ...cart, cartItems });
          this.cartService.cartSignal.set({ ...cart, cartItems });

          this.cartService.cartTotal.set(cartItems.length);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
      },
    });
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
