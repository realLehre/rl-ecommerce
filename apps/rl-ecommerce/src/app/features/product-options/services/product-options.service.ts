import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import {
  ICategory,
  IProductFilter,
  ISavedProductOptionQueries,
  ISubCategory,
} from '../models/product-options.interface';
import { of, retry, tap } from 'rxjs';
import { IProductResponse } from '../../products/model/product.interface';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProductOptionsService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  categoriesSignal = signal<ICategory[] | null>(null);
  currentCategory = signal<ICategory | null>(null);
  currentSubCategory = signal<ISubCategory | null>(null);
  currentPage = signal<number>(1);
  currentPriceFilter = signal<{ min: any; max: any } | null>(null);
  currentSort = signal<string | null>(null);
  currentRating = signal<number | null>(null);
  url = environment.apiUrl + 'categories';
  numberOfFilters = computed(() => {
    const priceFilter = this.currentPriceFilter();
    const sortFilter = this.currentSort();
    const ratingFilter = this.currentRating();
    return (
      Object.keys({
        ...(priceFilter && { priceFilter }),
        ...(sortFilter && { sortFilter }),
        ...(ratingFilter && { ratingFilter }),
      }).length ?? 0
    );
  });
  filter = computed<IProductFilter>(() => ({
    category: this.currentCategory()!,
    subCategory: this.currentSubCategory()!,
    page: this.currentPage(),
    minPrice: this.currentPriceFilter()?.min,
    maxPrice: this.currentPriceFilter()?.max,
    sortBy: this.currentSort()!,
    rating: this.currentRating()!,
  }));
  PRODUCTS_QUERY_KEY = 'hshs82haa02sshs92s';

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
    if (savedQuery?.minPrice) {
      this.currentPriceFilter.set({
        min: savedQuery?.minPrice,
        max: savedQuery?.maxPrice,
      });
    }
    if (savedQuery?.sort) {
      this.currentSort.set(savedQuery?.sort);
    }

    if (savedQuery?.rating) {
      this.currentRating.set(savedQuery?.rating);
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        ...this.createRouteQuery(),
      },
      queryParamsHandling: 'merge',
      fragment: 'products',
    });
  }

  getCategories() {
    return this.categoriesSignal()
      ? of(this.categoriesSignal())
      : this.http.get<ICategory[]>(`${this.url}`).pipe(
          retry(3),
          tap((res) => this.categoriesSignal.set(res)),
        );
  }

  setDataAndRoute() {
    const savedQuery: ISavedProductOptionQueries = JSON.parse(
      sessionStorage.getItem(this.PRODUCTS_QUERY_KEY)!,
    );

    sessionStorage.setItem(
      this.PRODUCTS_QUERY_KEY,
      JSON.stringify({ ...savedQuery, ...this.filter() }),
    );
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        ...this.createRouteQuery(),
      },
      queryParamsHandling: 'merge',
      fragment: 'products',
    });
  }

  createRouteQuery() {
    return {
      category: this.createSlug(this.filter()?.category?.name!),
      subCategory: this.createSlug(this.filter()?.subCategory?.name!),
      page: this.filter().page,
      minPrice: this.filter().minPrice,
      maxPrice: this.filter().maxPrice,
      sortBy: this.filter().sortBy,
      rating: this.filter().rating ? this.filter().rating + '-' + 5 : null,
    };
  }

  clearFilter() {
    this.currentSort.set(null);
    this.currentRating.set(null);
    this.currentPriceFilter.set(null);
    this.currentPriceFilter.set(null);
    this.setDataAndRoute();
  }

  createSlug(name: string): string {
    return name
      ?.toLowerCase()
      ?.replace(/[^a-z0-9]+/g, '-')
      ?.replace(/^-+|-+$/g, '');
  }
}
