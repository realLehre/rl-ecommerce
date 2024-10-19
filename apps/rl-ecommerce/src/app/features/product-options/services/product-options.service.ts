import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ICategory } from '../models/product-options.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductOptionsService {
  private http = inject(HttpClient);
  categoriesSignal = signal(null);
  url = environment.apiUrl + 'category';
  constructor() {}

  getCategories() {
    return this.http.get<ICategory[]>(`${this.url}`);
  }
}
