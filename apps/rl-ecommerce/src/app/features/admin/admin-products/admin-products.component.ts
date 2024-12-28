import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { AdminProductsService } from './services/admin-products.service';
import { GenericTableComponent } from '../../../shared/components/generic-table/generic-table.component';
import { CurrencyPipe, DatePipe, DecimalPipe, NgClass } from '@angular/common';
import {
  IProduct,
  IProductResponse,
  ICategory,
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
import { ProductOptionsService } from '../../product-options/services/product-options.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { PrimeNgDatepickerDirective } from '../../../shared/directives/prime-ng-datepicker.directive';
import { IAdminProductFilter } from './admin-product.interface';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductDeleteDialogComponent } from './product-delete-dialog/product-delete-dialog.component';
import { ToastService } from '../../../shared/services/toast.service';

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
    PrimeNgDatepickerDirective,
  ],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProductsComponent implements OnInit {
  private productService = inject(AdminProductsService);
  private optionsService = inject(ProductOptionsService);
  private router = inject(Router);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);
  category = input<ICategory>();
  injecting = input<boolean>(false);
  productData!: IProductResponse;
  selectedProduct!: IProduct;
  sortUsed: boolean = false;
  sortColumn: keyof IProduct | keyof ICategory | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  @ViewChild('filterMenu') menu!: Menu;
  @ViewChild('menu') productActionMenu!: Menu;
  filterNumber = 0;
  rangeValues = [2000, 10000];
  categories = toSignal(this.optionsService.getCategories());
  selectedCategory!: ICategory;
  subCategories: ISubCategory[] = [];
  selectedSubCategory!: ICategory;
  filter: IAdminProductFilter = {
    itemsToShow: 10,
    page: 1,
    category: this.category(),
  };
  rangeDates: any[] = [];
  isFetching = signal(true);
  isError = signal(false);
  config: PaginationInstance = {
    id: 'adminProducts',
    itemsPerPage: 10,
    currentPage: 1,
  };
  productQueried = this.productService.productQueried;
  private dialogService = inject(DialogService);
  private ref: DynamicDialogRef | undefined;

  ngOnInit() {
    if (this.category()) {
      this.filter = {
        ...this.filter,
        category: this.category(),
      };

      this.subCategories = [...this.category()?.subCategories!];
    }
    const savedFilters = JSON.parse(
      sessionStorage.getItem(this.productService.PRODUCT_QUERY_STORED_KEY)!,
    );
    if (savedFilters) {
      this.filter = {
        ...savedFilters,
        itemsToShow: savedFilters?.itemsToShow ?? 10,
      };
    }
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
    if (!this.injecting()) {
      this.router.navigate([], {
        queryParams: newRouteQueries,
        relativeTo: this.route,
      });
    }
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
      name: this.filter.name,
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
      },
      error: (err) => {
        this.isFetching.set(false);
        this.isError.set(true);
        this.toast.showToast({
          type: 'error',
          message: err.error.message || 'Failed to load order',
        });
      },
    });
  }

  onRetryLoad() {
    this.getProducts();
  }

  onViewDetails() {
    this.router.navigate(['/', 'admin', 'products', this.selectedProduct.id]);
  }

  onEdit() {
    localStorage.setItem(
      'selectedProduct',
      JSON.stringify(this.selectedProduct),
    );
    this.router.navigate(['/', 'admin', 'add-product'], {
      queryParams: { edit: true },
    });
  }

  onDelete() {
    this.productService.productToDelete.set(this.selectedProduct);
    this.ref = this.dialogService.open(ProductDeleteDialogComponent, {
      width: '25rem',
      breakpoints: {
        '450px': '90vw',
      },
      focusOnShow: false,
    });

    this.ref.onClose.subscribe((res) => {
      if (res == 'deleted') {
        this.onReturn();
      }
    });
  }

  onApplyFilter() {
    this.filterNumber = this.findFilterNumber();
    if (!this.injecting()) {
      sessionStorage.setItem(
        this.productService.PRODUCT_QUERY_STORED_KEY,
        JSON.stringify(this.filter),
      );
      this.router.navigate([], {
        queryParams: this.createRouteQuery(),
        relativeTo: this.route,
      });
    }
    this.getProducts();
    this.menu.hide();
  }

  pageChange(event: any) {
    this.filter = { ...this.filter, page: event };
    if (!this.injecting()) {
      sessionStorage.setItem(
        this.productService.PRODUCT_QUERY_STORED_KEY,
        JSON.stringify(this.filter),
      );
      this.router.navigate([], {
        queryParams: { page: event },
        relativeTo: this.route,
      });
    }
    this.getProducts();
  }

  itemsToShowChange(event: number) {
    this.config.itemsPerPage = event;
    this.filter = { ...this.filter, itemsToShow: event };
    if (!this.injecting()) {
      sessionStorage.setItem(
        this.productService.PRODUCT_QUERY_STORED_KEY,
        JSON.stringify(this.filter),
      );
    }
    this.getProducts();
  }

  onOpenProductActionMenu(event: Event, product: IProduct) {
    this.productActionMenu.show(event);
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

  onChangeCategory(cat: ICategory | any) {
    this.selectedCategory = cat;
    this.filter = { ...this.filter, page: 1, category: cat };
    this.subCategories = cat?.subCategories!;
  }

  onChangeSubCategory(subCat: ISubCategory) {
    if (!this.injecting()) {
      this.selectedSubCategory = subCat;
    }
    this.filter = { ...this.filter, page: 1, subCategory: subCat };
  }

  onRangeValueChanged(value: any[]) {
    this.filter = {
      ...this.filter,
      minPrice: value[0],
      maxPrice: value[1],
    };
  }

  searchChanged(name: string | null) {
    this.filter = { ...this.filter, name: name!, page: 1 };
    if (!this.injecting()) {
      sessionStorage.setItem(
        this.productService.PRODUCT_QUERY_STORED_KEY,
        JSON.stringify(this.filter),
      );
      this.router.navigate([], {
        queryParams: { name },
        relativeTo: this.route,
      });
    }
    this.getProducts();
  }

  onClearFilter() {
    if (this.filterNumber == 0) {
      return;
    }
    this.router.navigate([], {
      queryParams: null,
      queryParamsHandling: 'replace',
      relativeTo: this.route,
    });
    this.onReturn();
    this.menu.hide();
  }

  onReturn() {
    this.filter = {
      itemsToShow: 10,
      page: 1,
      category: this.category(),
    };
    this.rangeDates = [];
    this.rangeValues = [2000, 10000];
    sessionStorage.removeItem(this.productService.PRODUCT_QUERY_STORED_KEY);
    this.filterNumber = 0;
    this.productService.productQueried.set(false);
    this.router.navigate([], {
      queryParams: null,
      queryParamsHandling: 'replace',
      relativeTo: this.route,
    });
    // this.searchInput.reset();
    this.getProducts();
  }

  findFilterNumber() {
    let number = 0;
    for (const key in this.filter) {
      if (
        (key == 'category' && !this.injecting) ||
        key == 'subCategory' ||
        key == 'minPrice' ||
        key == 'minDate'
      ) {
        number += 1;
      }
    }
    return number;
  }

  sortTable(column: any): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortUsed = true;

    this.productData.products.sort((a: any, b: any) => {
      let valueA, valueB;
      if (column == 'category') {
        if (!this.injecting()) {
          valueA = a[column].name;
          valueB = b[column].name;
        } else {
          valueA = a['subCategory'].name;
          valueB = b['subCategory'].name;
        }
      } else {
        valueA = a[column];
        valueB = b[column];
      }

      if (valueA && valueB) {
        if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      }

      return 0;
    });
  }
}
