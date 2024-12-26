import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { IOrderFilter } from '../admin-orders/services/admin-order.service';
import { IOrder } from '../../../shared/models/order.interface';

export interface IAdminUserFilter {
  page: number;
  itemsPerPage: number;
  search?: string;
}

export interface IUserRes {
  currentPage: number;
  totalItems: number;
  totalItemsInPage: number;
  totalPages: number;
  users: {
    id: string;
    email: string;
    name: string;
    phoneNumber: string;
    createdAt: string;
    updateAt: string;
  }[];
}

export interface IAdminSingleUser {
  id: string;
  email: string;
  name: string;
  phoneNumber: string;
  createdAt: string;
  updateAt: string;
  orders: IOrder[];
}

@Injectable({
  providedIn: 'root',
})
export class AdminUserService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + 'users';
  userDataQueried = signal(false);
  userDataSignal = signal<IUserRes | null>(null);
  USER_QUERY_STORE_KEY = 'jdh&3dh028dn&39dkgs';

  getUsers(filter: IAdminUserFilter) {
    let params = new HttpParams();
    if (filter.page) {
      params = params.set('page', filter.page);
      this.userDataQueried.set(true);
    }
    if (filter.itemsPerPage) {
      params = params.set('itemsPerPage', filter.itemsPerPage);
      this.userDataQueried.set(true);
    }
    if (filter.search) {
      params = params.set('search', filter.search);
      this.userDataQueried.set(true);
    }
    return this.userDataSignal()
      ? of(this.userDataSignal())
      : this.http
          .get<IUserRes>(`${this.apiUrl}`, { params })
          .pipe(catchError(this.handleError));
  }

  getUserById(id: string) {
    return this.http.get<IAdminSingleUser>(`${this.apiUrl}/${id}`);
  }

  createRouteQuery(filter: IAdminUserFilter) {
    return {
      page: filter.page,
      itemsPerPage: filter.itemsPerPage,
      search: filter.search,
    };
  }

  private handleError(error: any) {
    return throwError(() => new Error('An error occurred! Try again later'));
  }
}
