import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { RouterLink } from '@angular/router';
import { EmptyCartComponent } from './empty-cart/empty-cart.component';
import { SkeletonModule } from 'primeng/skeleton';
import { ProductsService } from '../products/services/products.service';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ProductQuantityComponent } from '../../shared/components/product-quantity/product-quantity.component';
import { CartService } from '../../shared/services/cart.service';
import { ICartItems } from '../../shared/models/cart.interface';
import { of } from 'rxjs';

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
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent implements OnInit {
  productService = inject(ProductsService);
  private cartService = inject(CartService);
  cart$ = this.cartService.getCart();
  quantity: number = 1;
  isUpdating = signal<boolean[]>([false]);
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
}
