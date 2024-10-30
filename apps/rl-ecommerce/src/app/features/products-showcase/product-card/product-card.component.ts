import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { CurrencyPipe, NgClass, NgStyle } from '@angular/common';
import { Router } from '@angular/router';
import {
  IProduct,
  IProductRating,
} from '../../products/model/product.interface';
import { ProductsService } from '../../products/services/products.service';
import { SkeletonModule } from 'primeng/skeleton';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { CartService } from '../../../shared/services/cart.service';
import { ToastService } from '../../../shared/services/toast.service';
import { UserAccountService } from '../../user/user-account/services/user-account.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe, SkeletonModule, LoaderComponent, NgClass, NgStyle],
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
  stars = signal(
    Array.from({ length: 5 }, (_, i) => ({ star: i + 1, active: false })),
  );
  halfPercentage!: number;

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

  averageRating(): number {
    const totalRating = this.product().ratings.reduce(
      (acc: number, rating: any) => acc + rating.rating,
      0,
    );
    return totalRating / this.product().ratings.length || 0; // Return 0 if there are no ratings
  }

  getStarWidth(starIndex: number): string {
    const fullStars = Math.floor(this.averageRating()); // Number of fully colored stars
    const partialFill = (this.averageRating() % 1) * 100; // Percentage for partial star

    // Set full color for stars that should be fully filled
    if (starIndex < fullStars) {
      return '100%';
    }
    // Set partial color for the next star if applicable
    else if (starIndex === fullStars) {
      return `${partialFill}%`;
    }
    // No color for the remaining stars
    else {
      return '0%';
    }
  }
}
