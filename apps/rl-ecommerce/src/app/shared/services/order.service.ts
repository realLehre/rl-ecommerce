import { inject, Injectable, signal } from '@angular/core';
import { UserAccountService } from '../../features/user/user-account/services/user-account.service';
import { IAddress } from '../../features/user/models/address.interface';
import { ICart, ICartItems } from '../models/cart.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IOrder } from '../models/order.interface';
import { of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private userService = inject(UserAccountService);
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + 'order';
  user = this.userService.user;
  orderSignal = signal<IOrder[] | null>(null);
  activeOrder = signal<IOrder | null>(null);

  constructor() {}

  getOrder() {
    return this.orderSignal()
      ? of(this.orderSignal)
      : this.http.get<IOrder[]>(`${this.apiUrl}/${this.user()?.id}`).pipe(
          tap((res) => {
            this.orderSignal.set(res);
          }),
        );
  }

  getOrderById(id: string) {
    return this.http.get<IOrder>(`${this.apiUrl}/user/${id}`);
  }

  placeOrder(data: { address: IAddress; cart: ICart; paymentMethod: string }) {
    const orderData = {
      userId: this.user()?.id,
      cart: data.cart,
      shippingInfoId: data.address.id,
      orderAmount: this.getTotalItemAmount(data.cart),
      shippingCost: this.getShippingCost(data.cart),
      totalAmount:
        this.getTotalItemAmount(data.cart) + this.getShippingCost(data.cart),
      paymentMethod: data.paymentMethod,
      orderStatus: 'CONFIRMED',
      deliveryStatus: 'PENDING',
    };

    return this.http.post(`${this.apiUrl}/create`, orderData);
  }

  getTotalItemAmount(cart: ICart) {
    return cart.cartItems.reduce((acc: number, item: ICartItems) => {
      return (acc += item.total);
    }, 0);
  }

  getShippingCost(cart: ICart) {
    return cart.cartItems.reduce((acc: number, item: ICartItems) => {
      return (acc += item.shippingCost);
    }, 0);
  }
}
