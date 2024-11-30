import { inject, Injectable, signal } from '@angular/core';
import { of, retry, tap } from 'rxjs';
import {
  ICategory,
  IProduct,
  IProductResponse,
  ISubCategory,
} from '../../../products/model/product.interface';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface IAdminProductFilter {
  minPrice?: number;
  maxPrice?: number;
  itemsToShow: number;
  page?: number;
  productId?: string;
  productName?: string;
  category?: ICategory;
  subCategory?: ISubCategory;
  minDate?: any;
  maxDate?: any;
  name?: string;
}

export interface IProductImages {
  hasUploaded: boolean;
  isUploading: boolean;
  selectedFile: File | null;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminProductsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + 'product';
  activeProduct = signal<IProduct | null>(null);
  productQueried = signal(false);
  PRODUCT_QUERY_STORED_KEY = 'D82jxf927jks20jds';

  constructor() {}

  getProducts(filters: IAdminProductFilter) {
    let params = new HttpParams();

    if (filters?.minPrice) {
      params = params.set('minPrice', filters.minPrice.toString());
      this.productQueried.set(true);
    }
    if (filters?.maxPrice) {
      params = params.set('maxPrice', filters.maxPrice.toString());
      this.productQueried.set(true);
    }
    if (filters?.category) {
      params = params.set('categoryId', filters.category.id);
      this.productQueried.set(true);
    }
    if (filters?.page) {
      params = params.set('page', filters.page);
    }
    if (filters?.itemsToShow) {
      params = params.set('pageSize', filters.itemsToShow);
    }
    if (filters?.subCategory) {
      params = params.set('subCategoryId', filters.subCategory.id);
      this.productQueried.set(true);
    }
    if (filters?.minDate) {
      params = params.set('minDate', filters.minDate);
      this.productQueried.set(true);
    }
    if (filters?.maxDate) {
      params = params.set('maxDate', filters.maxDate);
      this.productQueried.set(true);
    }
    if (filters?.name) {
      params = params.set('name', filters.name);
      this.productQueried.set(true);
    }

    return this.http
      .get<IProductResponse>(`${this.apiUrl}/all`, { params })
      .pipe(retry(3));
  }

  getProductById(id: string) {
    return this.http.get<IProduct>(`${this.apiUrl}/${id}`).pipe(
      retry(3),
      tap((res) => this.activeProduct.set(res)),
    );
  }

  createSlug(name: string): any {
    if (!name) return;
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace spaces and special characters with hyphen
      .replace(/^-+|-+$/g, ''); // Trim leading or trailing hyphens
  }

  formatDate(date: Date) {
    return new Date(date).toISOString();
  }

  formatDateToLocale(date: Date) {
    return new Date(date);
  }
}
