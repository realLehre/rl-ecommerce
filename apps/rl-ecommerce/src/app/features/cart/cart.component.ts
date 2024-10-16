import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { RouterLink } from '@angular/router';
import { EmptyCartComponent } from './empty-cart/empty-cart.component';
import { SkeletonModule } from 'primeng/skeleton';
import { ProductsService } from '../products/services/products.service';
import { CurrencyPipe } from '@angular/common';
import { ProductQuantityComponent } from '../../shared/components/product-quantity/product-quantity.component';

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
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent implements OnInit {
  productService = inject(ProductsService);
  quantity: number = 1;
  cartItems: any[] = [];
  isLoading: boolean = false;
  ngOnInit() {
    this.cartItems = this.productService.products.slice(0, 4);
    setTimeout(() => {
      this.isLoading = false;
    }, 4000);
  }

  onAdjustQuantity(qty: number) {
    this.quantity = qty;
  }
}
