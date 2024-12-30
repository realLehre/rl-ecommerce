import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, of, tap, throwError } from 'rxjs';
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
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  sortUsed: boolean = false;

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

  sortTable(
    column: any,
    data: IUserRes,
  ): {
    sortedData: IUserRes;
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

    const sortedData = data.users.sort((a: any, b: any) => {
      let valueA, valueB;

      valueA = a[column];
      valueB = b[column];

      if (valueA && valueB) {
        if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      }

      return 0;
    });

    return {
      sortedData: { ...data, users: sortedData },
      sortDirection: this.sortDirection,
      sortUsed: this.sortUsed,
    };
  }

  private handleError(error: any) {
    return throwError(() => new Error('An error occurred! Try again later'));
  }
}
