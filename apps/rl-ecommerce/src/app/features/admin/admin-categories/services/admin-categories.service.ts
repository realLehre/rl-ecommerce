import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import {
  Categories,
  IAdminCategoriesResponse,
} from '../admin-categories.interface';

export interface IAdminCategoryFilter {
  page: number;
  pageSize: number;
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
  categoriesSignal = signal<IAdminCategoriesResponse | undefined>(undefined);
  activeCategory = signal<Categories | undefined>(undefined);
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  sortUsed: boolean = false;

  constructor() {}

  getCategories(filter: IAdminCategoryFilter): Observable<any> {
    let params = new HttpParams();
    Object.entries(filter)
      .filter(([_, value]) => value != undefined || value != null)
      .forEach(([key, value]) => {
        params = params.set(key, value);

        if (key == 'search') {
          this.categoriesDataQueried.set(true);
        }
      });
    return this.categoriesSignal()
      ? of(this.categoriesSignal())
      : this.http
          .get<IAdminCategoriesResponse>(this.apiUrl + '/all', { params })
          .pipe(
            catchError(this.handleError),
            tap((res) => this.categoriesSignal.set(res)),
          );
  }

  getCategoryById(id: string): Observable<Categories> {
    return this.http
      .get<Categories>(this.apiUrl + '/' + id)
      .pipe(catchError(this.handleError));
  }

  addCategory(data: { name: string; subCategories: string[] }) {
    return this.http.post(this.apiUrl + '/create', data);
  }

  deleteCategory(id: string) {
    return this.http.delete(this.apiUrl + '/delete/' + id);
  }

  updateCategory(data: { name: string; subCategories: string[] }, id: string) {
    return this.http.put(this.apiUrl + '/update/' + id, data);
  }

  createRouteQuery(filter: IAdminCategoryFilter) {
    return {
      page: filter.page,
      pageSize: filter.pageSize,
      search: filter.search,
    };
  }

  sortTable(
    column: any,
    data: IAdminCategoriesResponse,
  ): {
    sortedData: IAdminCategoriesResponse;
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

    const sortedData = data.categories.sort((a: any, b: any) => {
      let valueA, valueB;
      if (column == '_count') {
        valueA = a[column].products.toString();
        valueB = b[column].products.toString();
      } else {
        valueA = a[column];
        valueB = b[column];
      }

      if (valueA && valueB) {
        if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      }

      return 0;
    });

    return {
      sortedData: { ...data, categories: sortedData },
      sortDirection: this.sortDirection,
      sortUsed: this.sortUsed,
    };
  }

  private handleError(error: any) {
    return throwError(() => new Error('An error occurred! Try again later'));
  }
}
