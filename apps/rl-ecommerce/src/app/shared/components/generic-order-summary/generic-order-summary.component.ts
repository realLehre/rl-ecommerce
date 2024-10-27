import { Component, inject, input } from '@angular/core';
import { ICartItems } from '../../models/cart.interface';
import { CurrencyPipe } from '@angular/common';
import {
  GrandTotalPipe,
  SubtotalPipe,
  TotalDeliveryPipe,
} from '../../pipes/subtotal.pipe';
import { SkeletonModule } from 'primeng/skeleton';
import { Router } from '@angular/router';
import { ProductsService } from '../../../features/products/services/products.service';
import { IProduct } from '../../../features/products/model/product.interface';

@Component({
  selector: 'app-generic-order-summary',
  standalone: true,
  imports: [
    CurrencyPipe,
    SubtotalPipe,
    TotalDeliveryPipe,
    GrandTotalPipe,
    SkeletonModule,
  ],
  templateUrl: './generic-order-summary.component.html',
  styleUrl: './generic-order-summary.component.scss',
})
export class GenericOrderSummaryComponent {
  router = inject(Router);
  private productService = inject(ProductsService);
  paymentMethod = input<string>();
  cartItems = input<ICartItems[]>([]);

  onViewDetails(product: any) {
    this.productService.activeProduct.set(product);
    this.router.navigate(
      ['/product/' + this.productService.createSlug(product.name)],
      {
        queryParams: { id: product.id },
      },
    );
  }
}
