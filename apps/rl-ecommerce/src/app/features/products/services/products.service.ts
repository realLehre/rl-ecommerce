import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { IProduct, IProductResponse } from '../model/product.interface';
import { catchError, of, retry, tap, throwError } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { IProductFilter } from '../../product-options/models/product-options.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + 'product/';
  productSignal = signal<IProductResponse | null>(null);
  activeProduct = signal<IProduct | null>(null);
  paginationConfig = signal<PaginationInstance | null>(null);
  pageSize = signal(10);
  searchedProductsSignal = signal<IProduct[] | null>(null);
  isSearchingProducts = signal(false);

  constructor() {}

  getProducts(filters?: IProductFilter) {
    let params = new HttpParams();
    Object.entries(filters!)
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
      });
    return this.productSignal()
      ? of(this.productSignal())
      : this.http.get<IProductResponse>(`${this.baseUrl}all`, { params }).pipe(
          retry(3),
          tap((res) => {
            this.paginationConfig.set({
              currentPage: res.currentPage,
              itemsPerPage: Math.max(res.totalItemsInPage, this.pageSize()),
              totalItems: res.totalItems,
              id: 'productPagination',
            });

            this.productSignal.set(res);
          }),
        );
  }

  getProductById(id: string) {
    return this.http.get<IProduct>(`${this.baseUrl}${id}`).pipe(
      retry(3),
      tap((res) => this.activeProduct.set(res)),
    );
  }

  getSimilarProducts(categoryId: string, productId: string) {
    return this.http
      .get<IProduct[]>(`${this.baseUrl}${productId}/similar/${categoryId}`)
      .pipe(retry(3));
  }

  getSearchedProducts(input: string) {
    this.isSearchingProducts.set(true);
    return this.searchedProductsSignal()
      ? of(this.searchedProductsSignal())
      : this.http
          .get<IProduct[]>(`${this.baseUrl}?search=${input}`)
          .pipe(
            tap((res) => {
              this.searchedProductsSignal.set(res);
              this.isSearchingProducts.set(false);
            }),
          )
          .subscribe();
  }

  createSlug(name: string): any {
    if (!name) return;
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace spaces and special characters with hyphen
      .replace(/^-+|-+$/g, ''); // Trim leading or trailing hyphens
  }

  private handleError(error: any) {
    return throwError(() => new Error('An error occurred! Try again later'));
  }
}
