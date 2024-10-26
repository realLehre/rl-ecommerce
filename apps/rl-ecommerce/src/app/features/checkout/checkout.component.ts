import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { CheckoutAddressComponent } from './checkout-address/checkout-address.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { PaymentOptionsComponent } from './payment-options/payment-options.component';
import { IAddress } from '../user/models/address.interface';
import { CartService } from '../../shared/services/cart.service';
import { ICart } from '../../shared/models/cart.interface';
import { Router, RouterLink } from '@angular/router';
import { OrderService } from '../../shared/services/order.service';
import { ToastService } from '../../shared/services/toast.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    CheckoutAddressComponent,
    OrderSummaryComponent,
    PaymentOptionsComponent,
    RouterLink,
    LoaderComponent,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutComponent {
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private toast = inject(ToastService);
  private router = inject(Router);
  cart = this.cartService.cartSignal as WritableSignal<ICart>;
  selectedAddress!: IAddress;
  selectPaymentMethod!: string;
  isLoading = signal(false);
  onSelectedAddress(address: IAddress) {
    this.selectedAddress = address;
  }

  onSelectPaymentMethod(method: string) {
    this.selectPaymentMethod = method;
  }

  onPay() {
    this.isLoading.set(true);
    this.orderService
      .placeOrder({
        address: this.selectedAddress,
        cart: this.cart(),
        paymentMethod: this.selectPaymentMethod,
      })
      .subscribe({
        next: (res) => {
          this.cartService.cartSignal.set(null);
          this.cartService.cartTotal.set(null);
          this.cartService.getCart().subscribe();
          localStorage.removeItem(this.cartService.CART_KEY);
          this.toast.showToast({
            type: 'success',
            message: 'Order placed successfully!',
          });
          this.isLoading.set(false);
          this.router.navigate(['/', 'orders']);
        },
        error: (err) => {
          this.toast.showToast({
            type: 'error',
            message: err.error.message,
          });
          this.isLoading.set(false);
        },
      });
  }
}
