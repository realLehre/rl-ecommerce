import { inject, Injectable, signal } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { catchError, Observable, throwError } from 'rxjs';
import { IAdminCategoriesResponse } from '../admin-categories.interface';

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

  private handleError(error: any) {
    return throwError(() => new Error('An error occurred! Try again later'));
  }
}
