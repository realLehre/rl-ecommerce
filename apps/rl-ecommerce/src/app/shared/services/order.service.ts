import { inject, Injectable, signal } from '@angular/core';
import { UserAccountService } from '../../features/user/user-account/services/user-account.service';
import { IAddress } from '../../features/user/models/address.interface';
import { ICart, ICartItems } from '../models/cart.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { IOrder, IOrderResponse } from '../models/order.interface';
import { catchError, of, tap, throwError } from 'rxjs';

export interface IUserOrderFilter {
  minPrice?: number;
  maxPrice?: number;
  deliveryStatus?: string;
  pageSize: number;
  page?: number;
  orderId?: string;
  minDate?: any;
  maxDate?: any;
}

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
  ORDER_QUERY_STORED_KEY = 'sjs29shdndj20snshgff7';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  sortUsed: boolean = false;

  constructor() {}

  getOrders(filters: IUserOrderFilter) {
    this.orderQueried.set(false);
    let params = new HttpParams();

    Object.entries(filters)
      .filter(([_, value]) => value != undefined || value != null)
      .forEach(([key, value]) => {
        if (key == 'category') {
          params = params.set('categoryId', value.id);
        } else if (key == 'subCategory') {
          {
            params = params.set('subCategoryId', value.id);
          }
        } else {
          params = params.set(key, value);
        }

        if (key != 'page' && key != 'pageSize') {
          this.orderQueried.set(true);
        }
      });

    return this.orderSignal()
      ? of(this.orderSignal())
      : this.http
          .get<IOrderResponse>(`${this.apiUrl}/${this.user()?.id}`, { params })
          .pipe(
            tap((res) => {
              this.orderSignal.set(res);
            }),
            catchError(this.handleError),
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

  createRouteQuery(filter: IUserOrderFilter) {
    return {
      page: filter.page,
      pageSize: filter.pageSize,
      minPrice: filter.minPrice,
      maxPrice: filter.maxPrice,
      minDate: filter.minDate,
      maxDate: filter.maxDate,
      orderId: filter.orderId,
      deliveryStatus: filter.deliveryStatus,
    };
  }

  formatDate(date: Date) {
    return new Date(date).toISOString();
  }

  findFilterNumber(filter: IUserOrderFilter) {
    let number = 0;
    for (const key in filter) {
      if (key == 'deliveryStatus' || key == 'minPrice' || key == 'minDate') {
        number += 1;
      }
    }
    return number;
  }

  formatDateToLocale(date: Date) {
    return new Date(date);
  }

  sortTable(
    column: any,
    data: IOrderResponse,
  ): {
    sortedData: IOrderResponse;
    sortDirection: 'asc' | 'desc';
    sortUsed: boolean;
  } {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortUsed = true;

    const sortedData = data.orders.sort((a: any, b: any) => {
      const valueA = a[column];
      const valueB = b[column];

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;

      return 0;
    });

    return {
      sortedData: { ...data, orders: sortedData },
      sortDirection: this.sortDirection,
      sortUsed: this.sortUsed,
    };
  }

  private handleError(error: any) {
    return throwError(() => new Error('An error occurred! Try again later'));
  }
}
