import {
  ChangeDetectionStrategy,
  Component,
  inject,
  WritableSignal,
} from '@angular/core';
import { CartService } from '../../../shared/services/cart.service';
import { ICart } from '../../../shared/models/cart.interface';
import { CurrencyPipe } from '@angular/common';
import {
  GrandTotalPipe,
  SubtotalPipe,
  TotalDeliveryPipe,
} from '../../../shared/pipes/subtotal.pipe';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [
    CurrencyPipe,
    SubtotalPipe,
    TotalDeliveryPipe,
    GrandTotalPipe,
    SkeletonModule,
  ],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderSummaryComponent {
  private cartService = inject(CartService);
  cart = this.cartService.cartSignal as WritableSignal<ICart>;
}
