import { inject, Injectable, signal } from '@angular/core';
import { catchError, of, retry, tap, throwError } from 'rxjs';
import {
  ICategory,
  IProduct,
  IProductResponse,
  ISubCategory,
} from '../../../products/model/product.interface';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  IAdminProductFilter,
  IProductFormData,
} from '../admin-product.interface';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class AdminProductsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + 'product';
  activeProduct = signal<IProduct | null>(null);
  productToDelete = signal<IProduct | undefined>(undefined);
  productQueried = signal(false);
  PRODUCT_QUERY_STORED_KEY = 'D82jxf927jks20jds';

  constructor() {}

  getProducts(filters: IAdminProductFilter) {
    let params = new HttpParams();

    Object.entries(filters)
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

        if (key != 'page' && key != 'pageSize') {
          this.productQueried.set(true);
        }
      });

    return this.http
      .get<IProductResponse>(`${this.apiUrl}/all`, { params })
      .pipe(retry(3), catchError(this.handleError));
  }

  addProduct(formData: IProductFormData) {
    return this.http.post(this.apiUrl + '/create', formData);
  }

  updateProduct(formData: IProductFormData, id: string) {
    return this.http.patch<IProduct>(
      this.apiUrl + '/' + id + '/update',
      formData,
    );
  }

  deleteProduct(id: string) {
    return this.http.delete(this.apiUrl + '/' + id + '/delete');
  }

  getProductById(id: string) {
    return this.http.get<IProduct>(`${this.apiUrl}/${id}`).pipe(
      retry(3),
      tap((res) => this.activeProduct.set(res)),
      catchError(this.handleError),
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

  getFormControlStatus(form: FormGroup): boolean {
    return Object.values(form.controls).some(
      (control) =>
        control.value !== null && control.value !== '' && control.value !== 0,
    );
  }

  private handleError(error: any) {
    return throwError(() => new Error('An error occurred! Try again later'));
  }
}
