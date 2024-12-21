import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IProductResponse } from '../../../../products/model/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsLowInStockService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + 'product/';
  constructor() {}

  getProductsLowInStock(page: number) {
    let params = new HttpParams();
    params = params.set('page', page);
    return this.http.get<IProductResponse>(this.apiUrl + 'low-in-stock', {
      params,
    });
  }
}
