import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { IProduct, IProductResponse } from '../model/product.interface';
import { of, tap } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';

interface IProductFilter {
  categoryId?: string;
  subCategoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  page?: number;
}

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

    if (filters?.categoryId) {
      params = params.set('categoryId', filters.categoryId);
    }
    if (filters?.subCategoryId) {
      params = params.set('subCategoryId', filters.subCategoryId);
    }
    if (filters?.minPrice) {
      params = params.set('minPrice', filters.minPrice.toString());
    }
    if (filters?.maxPrice) {
      params = params.set('maxPrice', filters.maxPrice.toString());
    }
    if (filters?.sortBy) {
      params = params.set('sortBy', filters.sortBy);
    }
    if (filters?.page) {
      params = params.set('page', filters.page);
    }

    return this.productSignal()
      ? of(this.productSignal())
      : this.http.get<IProductResponse>(`${this.baseUrl}all`, { params }).pipe(
          tap((res) => {
            this.paginationConfig.set({
              currentPage: res.currentPage,
              itemsPerPage: this.pageSize(),
              totalItems: res.totalItems,
              id: 'productPagination',
            });

            this.productSignal.set(res);
          }),
        );
  }

  getProductById(id: string) {
    return this.http
      .get<IProduct>(`${this.baseUrl}${id}`)
      .pipe(tap((res) => this.activeProduct.set(res)));
  }

  getSimilarProducts(categoryId: string, productId: string) {
    return this.http.get<IProduct[]>(
      `${this.baseUrl}${productId}/similar/${categoryId}`,
    );
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
}
