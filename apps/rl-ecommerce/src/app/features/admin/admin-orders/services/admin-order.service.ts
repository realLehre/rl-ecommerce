import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import {
  IOrder,
  IOrderResponse,
} from '../../../../shared/models/order.interface';
import { Observable, of, retry, tap } from 'rxjs';

export interface IOrderFilter {
  minPrice?: number;
  maxPrice?: number;
  deliveryStatus?: string;
  itemsToShow: number;
  page?: number;
  search?: string;
  minDate?: any;
  maxDate?: any;
}

@Injectable({
  providedIn: 'root',
})
export class AdminOrderService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + 'order/';
  orderSignal = signal<IOrderResponse | null>(null);
  activeOrder = signal<IOrder | null>(null);
  ORDER_QUERY_STORED_KEY = 'sjei383dJDsdf3-dks-34';

  orderQueried = signal(false);
  constructor() {}

  getAllOrders(filters: IOrderFilter) {
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
    if (filters?.search) {
      params = params.set('search', filters.search);
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
      : this.http.get<IOrderResponse>(this.apiUrl + 'all', { params }).pipe(
          tap((res) => {
            this.orderSignal.set(res);
          }),
        );
  }

  getRecentOrders() {
    return this.http.get<IOrder[]>(this.apiUrl + 'recent').pipe(retry(3));
  }

  createRouteQuery(filter: IOrderFilter) {
    return {
      page: filter.page,
      minPrice: filter.minPrice,
      maxPrice: filter.maxPrice,
      minDate: filter.minDate,
      maxDate: filter.maxDate,
      search: filter.search,
      deliveryStatus: filter.deliveryStatus,
    };
  }

  formatDate(date: Date) {
    return new Date(date).toISOString();
  }

  formatDateToLocale(date: Date) {
    return new Date(date);
  }

  findFilterNumber(filter: IOrderFilter) {
    let number = 0;
    for (const key in filter) {
      if (key == 'deliveryStatus' || key == 'minPrice' || key == 'minDate') {
        number += 1;
      }
    }
    return number;
  }
}
