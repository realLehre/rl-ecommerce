import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {
  ICategory,
  ISavedProductOptionQueries,
  ISubCategory,
} from '../models/product-options.interface';
import { of, tap } from 'rxjs';
import { IProductResponse } from '../../products/model/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductOptionsService {
  private http = inject(HttpClient);
  categoriesSignal = signal<ICategory[] | null>(null);
  currentCategory = signal<ICategory | null>(null);
  currentSubCategory = signal<ISubCategory | null>(null);
  currentPage = signal<number>(1);
  url = environment.apiUrl + 'category';
  constructor() {
    const savedQuery: ISavedProductOptionQueries = JSON.parse(
      sessionStorage.getItem('hshs82haa02sshs92s')!,
    );

    if (savedQuery?.category) {
      this.currentCategory.set(savedQuery.category);
    }
    if (savedQuery?.subCategory) {
      this.currentSubCategory.set(savedQuery.subCategory);
    }
    if (savedQuery?.page) {
      this.currentPage.set(savedQuery.page);
    }
  }

  getCategories() {
    return this.categoriesSignal()
      ? of(this.categoriesSignal())
      : this.http
          .get<ICategory[]>(`${this.url}`)
          .pipe(tap((res) => this.categoriesSignal.set(res)));
  }

  createSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace spaces and special characters with hyphen
      .replace(/^-+|-+$/g, ''); // Trim leading or trailing hyphens
  }
}
