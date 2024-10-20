import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ICategory } from '../models/product-options.interface';
import { of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductOptionsService {
  private http = inject(HttpClient);
  categoriesSignal = signal<ICategory[] | null>(null);
  currentCategory = signal<ICategory | null>(null);
  currentSubCategory = signal<ICategory | null>(null);
  url = environment.apiUrl + 'category';
  constructor() {
    const savedQuery = JSON.parse(
      sessionStorage.getItem('hshs82haa02sshs92s')!,
    );

    if (savedQuery) {
      this.currentCategory.set(savedQuery?.category);
    }
  }

  getCategories() {
    return this.categoriesSignal()
      ? of(this.categoriesSignal())
      : this.http
          .get<ICategory[]>(`${this.url}`)
          .pipe(tap((res) => this.categoriesSignal.set(res)));
  }
}
