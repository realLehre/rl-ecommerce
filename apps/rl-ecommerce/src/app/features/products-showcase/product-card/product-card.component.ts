import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { IProduct } from '../../products/model/product.interface';
import { ProductsService } from '../../products/services/products.service';
import { SkeletonModule } from 'primeng/skeleton';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { CartService } from '../../../shared/services/cart.service';
import { ToastService } from '../../../shared/services/toast.service';
import { UserAccountService } from '../../user/user-account/services/user-account.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe, SkeletonModule, LoaderComponent],
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
  user = this.userService.user;
  product = input.required<IProduct>();
  isAddingToCart = signal(false);

  onViewDetails(product: IProduct) {
    this.productService.activeProduct.set(product);
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

          this.cartService.cartSignal.set(null);
          this.cartService.getCart().subscribe();
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
}
