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
import { PaymentService } from '../../shared/services/payment.service';

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
  private paymentService = inject(PaymentService);
  private toast = inject(ToastService);
  private router = inject(Router);
  cart = this.cartService.cartSignal as WritableSignal<ICart>;
  selectedAddress!: IAddress;
  selectPaymentMethod!: string;
  isLoading = signal(false);
  isInitiatingPayment = signal(false);
  onSelectedAddress(address: IAddress) {
    this.selectedAddress = address;
  }

  onSelectPaymentMethod(method: string) {
    this.selectPaymentMethod = method;
  }

  onInitiateOrder() {
    if (this.selectPaymentMethod == 'pay on delivery') {
      this.onPlaceOrder();
    } else {
      this.isInitiatingPayment.set(true);

      this.paymentService
        .initiatePayment({ amount: 100000, email: 'beed@beed.com' })
        .subscribe({
          next: (res) => {
            this.isInitiatingPayment.set(false);

            const total = Math.round(
              (this.orderService.getTotalItemAmount(this.cart()) +
                this.orderService.getShippingCost(this.cart())) *
                100,
            );
            const handler = new PaystackPop();

            handler.newTransaction({
              key: 'pk_test_b95a88357b0b5b7c4e20ccceb1ac928bb2f9a5bf',
              email: 'hhh@dudd.com',
              amount: Math.min(total, 10000000),
              currency: 'NGN',
              channels: ['card'],
              callback: (response) => {
                this.onPlaceOrder();
              },
              onClose: () => {},
            });
          },
          error: (err) => {
            this.isInitiatingPayment.set(false);

            this.toast.showToast({
              type: 'error',
              message: err.error.message,
            });
          },
        });
    }
  }

  onPlaceOrder() {
    this.isLoading.set(true);
    this.orderService
      .placeOrder({
        address: this.selectedAddress,
        cart: this.cart(),
        paymentMethod: this.selectPaymentMethod,
      })
      .subscribe({
        next: (res) => {
          this.router.navigate(['/', 'orders']).then(() => {
            setTimeout(() => {
              this.cartService.cartSignal.set(null);
            }, 300);
            this.cartService.cartTotal.set(null);
          });
          localStorage.removeItem(this.cartService.CART_KEY);
          this.cartService.getCart().subscribe();
          this.orderService.orderSignal.set(null);
          this.toast.showToast({
            type: 'success',
            message: 'Order placed successfully!',
          });
          this.isLoading.set(false);
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
