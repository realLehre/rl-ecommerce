import { inject, Injectable, signal } from '@angular/core';
import { UserAccountService } from '../../features/user/user-account/services/user-account.service';
import { IAddress } from '../../features/user/models/address.interface';
import { ICart, ICartItems } from '../models/cart.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { IOrder, IOrderResponse } from '../models/order.interface';
import { of, tap } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private userService = inject(UserAccountService);
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + 'order';
  user = this.userService.user;
  orderSignal = signal<IOrderResponse | null>(null);
  activeOrder = signal<IOrder | null>(null);

  orderQueried = signal(false);

  constructor() {}

  getOrder(filters: {
    minPrice?: number;
    maxPrice?: number;
    deliveryStatus?: string;
    itemsToShow: number;
    page?: number;
    orderId?: string;
    minDate?: any;
    maxDate?: any;
  }) {
    this.orderQueried.set(false);
    let params = new HttpParams();
    if (filters?.minPrice) {
      params = params.set('minPrice', filters.minPrice.toString());
      this.orderQueried.set(true);
    }
    if (filters?.maxPrice) {
      params = params.set('maxPrice', filters.maxPrice.toString());
      this.orderQueried.set(true);
    }
    if (filters?.deliveryStatus) {
      params = params.set('deliveryStatus', filters.deliveryStatus);
      this.orderQueried.set(true);
    }
    if (filters?.page) {
      params = params.set('page', filters.page);
    }
    if (filters?.itemsToShow) {
      params = params.set('pageSize', filters.itemsToShow);
    }
    if (filters?.orderId) {
      params = params.set('orderId', filters.orderId);
      this.orderQueried.set(true);
    }
    if (filters?.minDate) {
      params = params.set('minDate', filters.minDate);
      this.orderQueried.set(true);
    }
    if (filters?.maxDate) {
      params = params.set('maxDate', filters.maxDate);
      this.orderQueried.set(true);
    }
    return this.orderSignal()
      ? of(this.orderSignal())
      : this.http
          .get<IOrderResponse>(`${this.apiUrl}/${this.user()?.id}`, { params })
          .pipe(
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

  formatDate(date: Date) {
    return new Date(date).toISOString();
  }

  formatDateToLocale(date: Date) {
    return new Date(date);
  }
}
