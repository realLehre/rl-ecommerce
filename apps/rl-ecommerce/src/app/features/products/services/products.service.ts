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
  averageRating = computed(() => {
    if (this.activeProduct()?.ratings) {
      const totalRating = this.activeProduct()?.ratings.reduce(
        (acc: number, rating: any) => acc + rating.rating,
        0,
      );
      return totalRating! / this.activeProduct()?.ratings.length! || 0;
    } else {
      return 0;
    }
  });

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

  getStarWidth(starIndex: number): string {
    const fullStars = Math.floor(this.averageRating());
    const partialFill = (this.averageRating() % 1) * 100;

    if (starIndex < fullStars) {
      return '100%';
    } else if (starIndex === fullStars) {
      return `${partialFill}%`;
    } else {
      return '0%';
    }
  }

  getProductCartStarWidth(starIndex: number, averageRating: number) {
    const fullStars = Math.floor(averageRating);
    const partialFill = (averageRating % 1) * 100;

    if (starIndex < fullStars) {
      return '100%';
    } else if (starIndex === fullStars) {
      return `${partialFill}%`;
    } else {
      return '0%';
    }
  }
}
