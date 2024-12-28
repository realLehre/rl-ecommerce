import { inject, Injectable, signal } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { catchError, Observable, throwError } from 'rxjs';
import {
  Categories,
  IAdminCategoriesResponse,
} from '../admin-categories.interface';
import { IAdminUserFilter } from '../../admin-users/admin-user.service';

export interface IAdminCategoryFilter {
  page: number;
  itemsPerPage: number;
  search?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminCategoriesService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + 'categories';
  categoriesDataQueried = signal(false);
  CATEGORIES_QUERY_STORE_KEY = 'D93kdk*303dJp[xse32xhi3';

  getCategories(filter: IAdminCategoryFilter): Observable<any> {
    let params = new HttpParams();
    if (filter.search) {
      params = params.set('search', filter.search);
      this.categoriesDataQueried.set(true);
    }
    params = params.set('page', filter.page);
    params = params.set('itemsPerPage', filter.itemsPerPage);

    return this.http
      .get<IAdminCategoriesResponse>(this.apiUrl + '/all', { params })
      .pipe(catchError(this.handleError));
  }

  getCategoryById(id: string): Observable<Categories> {
    return this.http
      .get<Categories>(this.apiUrl + '/' + id)
      .pipe(catchError(this.handleError));
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
