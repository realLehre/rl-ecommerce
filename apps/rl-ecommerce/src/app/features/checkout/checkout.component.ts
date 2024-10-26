import {
  ChangeDetectionStrategy,
  Component,
  inject,
  WritableSignal,
} from '@angular/core';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { CheckoutAddressComponent } from './checkout-address/checkout-address.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { PaymentOptionsComponent } from './payment-options/payment-options.component';
import { IAddress } from '../user/models/address.interface';
import { CartService } from '../../shared/services/cart.service';
import { ICart } from '../../shared/models/cart.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    CheckoutAddressComponent,
    OrderSummaryComponent,
    PaymentOptionsComponent,
    RouterLink,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutComponent {
  private cartService = inject(CartService);
  cart = this.cartService.cartSignal as WritableSignal<ICart>;
  selectedAddress!: IAddress;
  selectPaymentMethod!: string;
  onSelectedAddress(address: IAddress) {
    this.selectedAddress = address;
  }

  onSelectPaymentMethod(method: string) {
    this.selectPaymentMethod = method;
  }

  onPay() {
    console.log(this.cart, this.selectedAddress, this.selectPaymentMethod);
  }
}
