import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import {
  IDeliveryEvents,
  IOrder,
  IOrderResponse,
} from '../../../../shared/models/order.interface';
import { catchError, Observable, of, retry, tap, throwError } from 'rxjs';

export interface IOrderFilter {
  minPrice?: number;
  maxPrice?: number;
  deliveryStatus?: string;
  pageSize: number;
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
      : this.http.get<IOrderResponse>(this.apiUrl + 'all', { params }).pipe(
          tap((res) => {
            this.orderSignal.set(res);
          }),
          catchError(this.handleError),
        );
  }

  updateOrder(status: string, order: IOrder) {
    const deliveryEvents: IDeliveryEvents[] = order.deliveryEvents;
    const updateBoth = status.toLowerCase() !== 'packed';

    if (updateBoth) {
      deliveryEvents.forEach((event) => {
        if (event.remark == 'Order assigned for delivery') {
          event['status'] = 'PACKED';
          event['updatedAt'] = new Date().toISOString();
        }

        if (event.remark == 'Order delivered') {
          event['status'] = 'DELIVERED';
          event['updatedAt'] = new Date().toISOString();
        }
      });
    } else {
      deliveryEvents.forEach((event) => {
        if (event.remark == 'Order assigned for delivery') {
          event['status'] = 'PACKED';
          event['updatedAt'] = new Date().toISOString();
        }
      });
    }

    return this.http.patch<IOrder>(this.apiUrl + 'update/' + order.id, {
      deliveryEvents,
      deliveryStatus: status,
    });
  }

  getRecentOrders() {
    return this.http.get<IOrder[]>(this.apiUrl + 'recent').pipe(retry(3));
  }

  getOrderById(id: string) {
    return this.activeOrder()
      ? of(this.activeOrder())
      : this.http
          .get<IOrder>(`${this.apiUrl}user/${id}`)
          .pipe(catchError(this.handleError));
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
      pageSize: filter.pageSize,
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

  private handleError(error: any) {
    return throwError(() => new Error('An error occurred! Try again later'));
  }
}
