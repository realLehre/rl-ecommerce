import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  Signal,
  signal,
  ViewChild,
} from '@angular/core';
import { AdminProductsService } from './services/admin-products.service';
import { GenericTableComponent } from '../../../shared/components/generic-table/generic-table.component';
import { CurrencyPipe, DatePipe, DecimalPipe, NgClass } from '@angular/common';
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
import { ProductOptionsService } from '../../product-options/services/product-options.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { PrimeNgDatepickerDirective } from '../../../shared/directives/prime-ng-datepicker.directive';
import { IAdminProductFilter } from './admin-product.interface';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductDeleteDialogComponent } from './product-delete-dialog/product-delete-dialog.component';
import { ToastService } from '../../../shared/services/toast.service';
import { IOrderFilter } from '../admin-orders/services/admin-order.service';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { IOrderResponse } from '../../../shared/models/order.interface';

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
  categoryData = input<ICategory>();
  injecting = input<boolean>(false);
  selectedProduct!: IProduct;
  sortUsed: boolean = false;
  sortDirection: 'asc' | 'desc' = 'asc';
  @ViewChild('filterMenu') menu!: Menu;
  @ViewChild('menu') productActionMenu!: Menu;
  filterNumber = 0;
  rangeValues = [2000, 10000];
  categories = toSignal(this.optionsService.getCategories());
  selectedCategory: ICategory | undefined;
  subCategories: ISubCategory[] = [];
  selectedSubCategory: ICategory | undefined;
  rangeDates: any[] = [];
  isError = signal(false);
  isLoading = signal(true);
  productQueried = this.productService.productQueried;
  private dialogService = inject(DialogService);
  private ref: DynamicDialogRef | undefined;
  pageSize = signal(10);
  filter = signal<IAdminProductFilter>({
    pageSize: this.pageSize(),
    page: 1,
  });
  refresh = signal(0);
  refreshTrigger = computed(() => ({
    filter: this.filter(),
    refresh: this.refresh(),
  }));
  holdFilter = signal<IOrderFilter>(this.filter());
  products$: Observable<IProductResponse | any> = toObservable(
    this.refreshTrigger,
  ).pipe(
    switchMap(({ filter }) =>
      this.productService.getProducts(filter).pipe(
        catchError((error) => {
          this.isLoading.set(false);
          this.toast.showToast({
            type: 'error',
            message: error.message || 'Failed to load products',
          });
          this.isError.set(true);
          return of(null);
        }),
      ),
    ),
    tap(() => {
      this.isLoading.set(false);
    }),
  );
  productsData: Signal<IProductResponse> = toSignal(this.products$);

  ngOnInit() {
    this.productService.productSignal.set(null);
    this.productService.productQueried.set(false);

    if (this.categoryData()) {
      this.filter.set({
        ...this.filter(),
        category: this.categoryData(),
      });

      this.subCategories = [...this.categoryData()?.subCategories!];
    }

    const savedFilters = JSON.parse(
      sessionStorage.getItem(this.productService.PRODUCT_QUERY_STORED_KEY)!,
    );

    this.filter.set({ ...this.filter(), ...savedFilters });
    this.holdFilter.set({
      ...this.holdFilter(),
      ...this.filter(),
    });

    this.filterNumber = this.productService.findFilterNumber(savedFilters);
    if (savedFilters?.minPrice && savedFilters?.maxPrice) {
      this.rangeValues = [savedFilters?.minPrice!, savedFilters?.maxPrice!];
    }

    if (savedFilters?.category) {
      this.selectedCategory = savedFilters?.category;
      this.subCategories = [...savedFilters?.category?.subCategories];
    }

    if (savedFilters?.subCategory) {
      this.selectedSubCategory = savedFilters?.subCategory;
    }
    if (savedFilters?.minDate && savedFilters?.maxDate) {
      const minDate = this.productService.formatDateToLocale(
        savedFilters.minDate,
      );
      const maxDate = this.productService.formatDateToLocale(
        savedFilters.maxDate,
      );
      this.rangeDates = [minDate, maxDate];
    }
    const newRouteQueries = Object.fromEntries(
      Object.entries(
        this.productService.createRouteQuery(this.filter()),
      ).filter(([_, value]) => value !== undefined),
    );

    if (!this.injecting()) {
      this.router.navigate([], {
        queryParams: newRouteQueries,
        relativeTo: this.route,
      });
    }
  }

  onRetryLoad() {
    this.refresh.update((count) => count + 1);
  }

  onViewDetails() {
    this.router.navigate(['/', 'admin', 'products', this.selectedProduct.id]);
  }

  onEdit() {
    this.productService.activeProduct.set(this.selectedProduct);
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

  pageChange(page: number) {
    this.isLoading.set(true);
    this.filter.set({ ...this.filter(), page });
    this.updateQueries({ page: page });
    window.scrollTo({
      top: 70,
      behavior: 'smooth',
    });
  }

  pageSizeChange(total: number) {
    this.pageSize.set(total);
    this.isLoading.set(true);
    this.filter.set({ ...this.filter(), page: 1, pageSize: total });
    this.updateQueries({ pageSize: total });
  }

  onRangeValueChanged(value: any[]) {
    this.updateQueries({ minPrice: value[0], maxPrice: value[1] });
  }

  searchChanged(value: any) {
    this.isLoading.set(true);
    this.filter.set({ ...this.filter(), name: value });
    this.updateQueries({ name: value });
  }

  onDateChanged() {
    if (this.rangeDates[0] && this.rangeDates[1]) {
      let dates = [...this.rangeDates];
      dates = dates.map((date) => this.productService.formatDate(date));
      this.updateQueries({ page: 1, minDate: dates[0], maxDate: dates[1] });
    }
  }

  onChangeCategory(cat: ICategory | any) {
    this.selectedCategory = cat;
    this.subCategories = cat?.subCategories!;
    this.updateQueries({ page: 1, category: cat });
  }

  onChangeSubCategory(subCat: ISubCategory) {
    if (!this.injecting()) {
      this.selectedSubCategory = subCat;
    }
    this.updateQueries({ page: 1, subCategory: subCat });
  }

  onApplyFilter() {
    this.isLoading.set(true);
    this.filter.set({ ...this.holdFilter() });
    this.filterNumber = this.productService.findFilterNumber(
      this.filter(),
      this.injecting(),
    );
    if (!this.injecting()) {
      sessionStorage.setItem(
        this.productService.PRODUCT_QUERY_STORED_KEY,
        JSON.stringify(this.filter()),
      );
      this.router.navigate([], {
        queryParams: this.productService.createRouteQuery(this.filter()),
        relativeTo: this.route,
      });
    }
    this.menu.hide();
  }

  updateQueries(updates: Partial<IAdminProductFilter>) {
    this.productService.productSignal.set(null);
    this.holdFilter.set({ ...this.holdFilter(), ...updates });
    if (!this.injecting()) {
      sessionStorage.setItem(
        this.productService.PRODUCT_QUERY_STORED_KEY,
        JSON.stringify(this.holdFilter()),
      );
      this.router.navigate([], {
        queryParams: this.productService.createRouteQuery(this.filter()),
        relativeTo: this.route,
      });
    }
  }

  onClearFilter() {
    if (this.filterNumber == 0) {
      return;
    }
    if (this.injecting()) {
      this.subCategories = [...this.categoryData()?.subCategories!];
    }
    this.selectedCategory = undefined;
    this.selectedSubCategory = undefined;
    this.router.navigate([], {
      queryParams: null,
      queryParamsHandling: 'replace',
      relativeTo: this.route,
    });
    this.onReturn();
    this.menu.hide();
  }

  onReturn() {
    this.rangeDates = [];
    this.rangeValues = [2000, 10000];
    sessionStorage.removeItem(this.productService.PRODUCT_QUERY_STORED_KEY);
    this.filterNumber = 0;
    this.productService.productQueried.set(false);
    this.router.navigate([], {
      queryParams: { page: 1, pageSize: 10 },
      queryParamsHandling: 'replace',
      relativeTo: this.route,
    });
    this.productService.productSignal.set(null);
    this.filter.set({
      pageSize: 10,
      page: 1,
    });
    if (this.injecting()) {
      this.filter.set({
        ...this.filter(),
        category: this.categoryData(),
      });
    }
    this.pageSize.set(10);
    this.selectedCategory = undefined;
    this.selectedSubCategory = undefined;
    this.holdFilter.set({ ...this.filter() });
    this.isLoading.set(true);
  }

  onOpenProductActionMenu(event: Event, product: IProduct) {
    this.productActionMenu.show(event);
    this.selectedProduct = product;
    this.productService.activeProduct.set(product);
  }

  sortTable(column: any): void {
    const { sortedData, sortDirection, sortUsed } =
      this.productService.sortTable(
        column,
        this.productsData()!,
        this.injecting(),
      );
    this.products$ = of(sortedData);
    this.sortDirection = sortDirection;
    this.sortUsed = sortUsed;
  }
}
