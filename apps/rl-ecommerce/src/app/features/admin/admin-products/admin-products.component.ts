import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import {
  AdminProductsService,
  IAdminProductFilter,
} from './services/admin-products.service';
import { GenericTableComponent } from '../../../shared/components/generic-table/generic-table.component';
import { CurrencyPipe, DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { IOrder } from '../../../shared/models/order.interface';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ICategory,
  IProduct,
  IProductResponse,
  ISubCategory,
} from '../../products/model/product.interface';
import { Menu, MenuModule } from 'primeng/menu';
import { PrimeTemplate } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { PaginationInstance } from 'ngx-pagination';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [
    GenericTableComponent,
    NgClass,
    CurrencyPipe,
    DatePipe,
    MenuModule,
    PrimeTemplate,
    CalendarModule,
    DecimalPipe,
    DropdownModule,
    SliderModule,
    FormsModule,
    SkeletonModule,
  ],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.scss',
})
export class AdminProductsComponent implements OnInit {
  private productService = inject(AdminProductsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  productData!: IProductResponse;
  selectedProduct!: IProduct;
  sortUsed: boolean = false;
  sortColumn: keyof IProduct | keyof ICategory | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  @ViewChild('filterMenu') menu!: Menu;
  filterNumber = 0;
  rangeValues = [2000, 10000];
  categories: ICategory[] = [];
  selectedCategory!: ICategory;
  subCategories: ISubCategory[] = [];
  selectedSubCategory!: ICategory;
  filter: IAdminProductFilter = {
    itemsToShow: 10,
    page: 1,
  };
  rangeDates: any[] = [];
  isFetching = signal(true);
  config: PaginationInstance = {
    id: 'userOrderPagination',
    itemsPerPage: 10,
    currentPage: 1,
  };

  ngOnInit() {
    const savedFilters = JSON.parse(
      sessionStorage.getItem(this.productService.PRODUCT_QUERY_STORED_KEY)!,
    );
    this.filter = {
      ...savedFilters,
      itemsToShow: savedFilters?.itemsToShow ?? 10,
    };
    this.filterNumber = this.findFilterNumber();
    if (this.filter.minPrice && this.filter.maxPrice) {
      this.rangeValues = [this.filter.minPrice, this.filter.maxPrice];
    }

    if (this.filter.minDate && this.filter.maxDate) {
      const minDate = this.productService.formatDateToLocale(
        this.filter.minDate,
      );
      const maxDate = this.productService.formatDateToLocale(
        this.filter.maxDate,
      );
      this.rangeDates = [minDate, maxDate];
    }

    const newRouteQueries = Object.fromEntries(
      Object.entries(this.createRouteQuery()).filter(
        ([_, value]) => value !== undefined,
      ),
    );

    this.router.navigate([], {
      queryParams: newRouteQueries,
      relativeTo: this.route,
    });
    this.getProducts();
  }

  createRouteQuery() {
    return {
      page: this.filter.page,
      category: this.productService.createSlug(this.filter.category?.name!),
      minPrice: this.filter.minPrice,
      maxPrice: this.filter.maxPrice,
      minDate: this.filter.minDate,
      maxDate: this.filter.maxDate,
      subCategory: this.productService.createSlug(
        this.filter.subCategory?.name!,
      ),
    };
  }

  getProducts() {
    this.isFetching.set(true);
    this.productService.getProducts(this.filter).subscribe({
      next: (res) => {
        this.isFetching.set(false);
        this.productData = res;
        const totalItemsToShow = Math.max(
          res?.totalItemsInPage!,
          this.filter.itemsToShow,
        );
        this.config.itemsPerPage = totalItemsToShow;
        this.config.currentPage = res?.currentPage!;
        this.config.totalItems = res?.totalItems;
        console.log(this.config);
        console.log(res);
      },
      error: (err) => {
        this.isFetching.set(false);
      },
    });
  }

  onViewDetails() {
    this.router.navigate(['/', 'admin', 'products', this.selectedProduct.id]);
  }

  onEdit() {}

  onDelete() {}

  onApplyFilter() {
    this.filterNumber = this.findFilterNumber();
    sessionStorage.setItem(
      this.productService.PRODUCT_QUERY_STORED_KEY,
      JSON.stringify(this.filter),
    );
    this.router.navigate([], {
      queryParams: this.createRouteQuery(),
      relativeTo: this.route,
    });
    this.getProducts();
    this.menu.hide();
  }

  pageChange(event: any) {
    this.filter = { ...this.filter, page: event };
    sessionStorage.setItem(
      this.productService.PRODUCT_QUERY_STORED_KEY,
      JSON.stringify(this.filter),
    );
    this.router.navigate([], {
      queryParams: { page: event },
      relativeTo: this.route,
    });
    this.getProducts();
  }

  itemsToShowChange(event: number) {
    this.config.itemsPerPage = event;
    this.filter = { ...this.filter, itemsToShow: event };
    sessionStorage.setItem(
      this.productService.PRODUCT_QUERY_STORED_KEY,
      JSON.stringify(this.filter),
    );
    this.getProducts();
  }

  onOpenMenu(event: Event, product: IProduct) {
    this.menu.show(event);
    this.selectedProduct = product;
    this.productService.activeProduct.set(product);
  }

  onDateChanged() {
    if (this.rangeDates[0] && this.rangeDates[1]) {
      let dates = [...this.rangeDates];
      dates = dates.map((date) => this.productService.formatDate(date));
      this.filter = {
        ...this.filter,
        page: 1,
        minDate: dates[0],
        maxDate: dates[1],
      };
    }
  }

  onChangeCategory(cat: ICategory) {
    this.selectedCategory = cat;
    this.filter = { ...this.filter, page: 1, category: cat };
    this.getProducts();
  }

  onChangeSubCategory(subcat: ISubCategory) {
    this.selectedSubCategory = subcat;
    this.filter = { ...this.filter, page: 1, subCategory: subcat };
    this.getProducts();
  }

  onRangeValueChanged(value: any[]) {
    this.filter = {
      ...this.filter,
      minPrice: value[0],
      maxPrice: value[1],
    };
  }

  onClearFilter() {
    if (this.filterNumber == 0) {
      return;
    }
    this.onReturn();
    this.menu.hide();
  }

  onReturn() {
    this.filter = {
      itemsToShow: 10,
      page: 1,
    };
    this.rangeDates = [];
    this.rangeValues = [2000, 10000];
    sessionStorage.removeItem(this.productService.PRODUCT_QUERY_STORED_KEY);
    this.filterNumber = 0;
    // this.searchInput.reset();
    this.getProducts();
  }

  findFilterNumber() {
    let number = 0;
    for (const key in this.filter) {
      if (
        key == 'category' ||
        key == 'subCategory' ||
        key == 'minPrice' ||
        key == 'minDate'
      ) {
        number += 1;
      }
    }
    return number;
  }

  sortTable(column: keyof IProduct | keyof ICategory): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortUsed = true;

    this.productData.products.sort((a, b) => {
      // if(column == 'category'){
      //   const valueA = a[column];
      //   const valueB = b[column];
      // } else {
      //
      // const valueA = a[column];
      // const valueB = b[column];
      // }

      const valueA = a[column];
      const valueB = b[column];

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;

      return 0;
    });
  }
}
