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
} from '../../products/model/product.interface';
import { Menu, MenuModule } from 'primeng/menu';
import { PrimeTemplate } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  productData!: IProductResponse;
  selectedProduct!: IProduct;
  sortUsed: boolean = false;
  sortColumn: keyof IProduct | keyof ICategory | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  @ViewChild('menu') menu!: Menu;
  filterNumber = 0;
  rangeValues = [2000, 10000];
  categories: ICategory[] = [];
  selectedCategory!: ICategory;
  itemsToShow: number[] = [1, 5, 10, 15, 20, 25];
  totalItemsToShow: number = 10;
  filter: IAdminProductFilter = {
    itemsToShow: this.totalItemsToShow,
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
    this.getProducts();
  }

  getProducts() {
    this.isFetching.set(true);
    this.productService.getProducts(this.filter).subscribe({
      next: (res) => {
        this.isFetching.set(false);
        this.productData = res;
        this.totalItemsToShow = Math.max(
          res?.totalItemsInPage!,
          this.totalItemsToShow,
        );
        this.config.itemsPerPage = this.totalItemsToShow;
        this.config.currentPage = res?.currentPage!;
        this.config.totalItems = res?.totalItems;
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
    // this.filterNumber = this.findFilterNumber();
    this.menu.hide();
  }

  pageChange(event: any) {
    this.filter = { ...this.filter, page: event };
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
    this.menu.hide();
    this.rangeValues = [2000, 10000];
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
