import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { IOrderFilter } from '../admin-orders/services/admin-order.service';
import { IOrder } from '../../../shared/models/order.interface';

export interface IAdminUserFilter {
  page: number;
  pageSize: number;
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
  userDataSignal = signal<IUserRes | undefined>(undefined);
  USER_QUERY_STORE_KEY = 'jdh&3dh028dn&39dkgs';

  getUsers(filter: IAdminUserFilter) {
    let params = new HttpParams();

    Object.entries(filter)
      .filter(([_, value]) => value != undefined || value != null)
      .forEach(([key, value]) => {
        params = params.set(key, value);

        if (key == 'search') {
          this.userDataQueried.set(true);
        }
      });

    return this.userDataSignal()
      ? of(this.userDataSignal())
      : this.http.get<IUserRes>(`${this.apiUrl}`, { params }).pipe(
          catchError(this.handleError),
          tap((res) => this.userDataSignal.set(res)),
        );
  }

  getUserById(id: string) {
    return this.http.get<IAdminSingleUser>(`${this.apiUrl}/${id}`);
  }

  createRouteQuery(filter: IAdminUserFilter) {
    return {
      page: filter.page,
      pageSize: filter.pageSize,
      search: filter.search,
    };
  }

  private handleError(error: any) {
    return throwError(() => new Error('An error occurred! Try again later'));
  }
}
