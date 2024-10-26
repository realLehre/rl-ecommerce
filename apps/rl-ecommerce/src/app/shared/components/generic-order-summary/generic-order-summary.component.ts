import { Component, input } from '@angular/core';
import { ICartItems } from '../../models/cart.interface';
import { CurrencyPipe } from '@angular/common';
import {
  GrandTotalPipe,
  SubtotalPipe,
  TotalDeliveryPipe,
} from '../../pipes/subtotal.pipe';
import { SkeletonModule } from 'primeng/skeleton';

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
  paymentMethod = input<string>();
  cartItems = input<ICartItems[]>([]);
}
