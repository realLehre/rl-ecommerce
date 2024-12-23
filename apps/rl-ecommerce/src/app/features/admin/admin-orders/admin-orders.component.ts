import {
  Component,
  inject,
  OnInit,
  Signal,
  signal,
  ViewChild,
} from '@angular/core';
import {
  AdminOrderService,
  IOrderFilter,
} from './services/admin-order.service';
import { GenericTableComponent } from '../../../shared/components/generic-table/generic-table.component';
import { Observable, switchMap, tap } from 'rxjs';
import { IOrder, IOrderResponse } from '../../../shared/models/order.interface';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { PaginationInstance } from 'ngx-pagination';
import { CurrencyPipe, DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { ICategory, IProduct } from '../../products/model/product.interface';
import { OrderStatusDirective } from '../../../shared/directives/order-status.directive';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { Menu, MenuModule } from 'primeng/menu';
import { PrimeTemplate } from 'primeng/api';
import { SliderModule } from 'primeng/slider';
import { FormsModule } from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';
import { ActivatedRoute, Router } from '@angular/router';
import { PrimeNgDatepickerDirective } from '../../../shared/directives/prime-ng-datepicker.directive';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [
    GenericTableComponent,
    NgClass,
    OrderStatusDirective,
    DatePipe,
    CurrencyPipe,
    CalendarModule,
    DecimalPipe,
    DropdownModule,
    MenuModule,
    PrimeTemplate,
    SliderModule,
    FormsModule,
    SkeletonModule,
    PrimeNgDatepickerDirective,
  ],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.scss',
})
export class AdminOrdersComponent implements OnInit {
  private readonly orderService = inject(AdminOrderService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  orderQueried = this.orderService.orderQueried;
  config: PaginationInstance = {
    id: 'adminOrdersPagination',
    itemsPerPage: 5,
    currentPage: 1,
  };
  totalItemsToShow = signal(10);
  filter = signal<IOrderFilter>({
    itemsToShow: this.totalItemsToShow(),
    page: 1,
  });
  holdFilter = signal<IOrderFilter>(this.filter());
  isLoading = signal(true);
  orders$: Observable<IOrderResponse | any> = toObservable(this.filter).pipe(
    switchMap((filter) => this.orderService.getAllOrders(filter)),
    tap((res) => {
      this.isLoading.set(false);
      this.config.itemsPerPage = Math.max(
        res?.totalItemsInPage!,
        this.totalItemsToShow(),
      );
      this.config.currentPage = res?.currentPage!;
      this.config.totalItems = res?.totalItems;
    }),
  );
  orderData: Signal<IOrderResponse> = toSignal(this.orders$);
  sortUsed: boolean = false;
  sortColumn: keyof IProduct | keyof ICategory | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  deliveryStatus: { name: string; code: string }[] = [
    { name: 'Pending', code: 'PENDING' },
    { name: 'Packed', code: 'PACKED' },
    { name: 'Delivered', code: 'DELIVERED' },
  ];
  selectedStatus!: { name: string; code: string };
  rangeValues = [2000, 10000];
  rangeValueChanged = signal(false);
  rangeDates: any[] = [];
  @ViewChild('menu') menu!: Menu;
  filterNumber = 0;

  ngOnInit() {
    const savedFilters = JSON.parse(
      sessionStorage.getItem(this.orderService.ORDER_QUERY_STORED_KEY) || '{}',
    );
    this.holdFilter.set({
      ...savedFilters,
      itemsToShow: savedFilters?.itemsToShow ?? 10,
    });

    const currentFilter = this.holdFilter();

    this.filterNumber = this.orderService.findFilterNumber(currentFilter);

    if (currentFilter.minPrice && currentFilter.maxPrice) {
      this.rangeValues = [currentFilter.minPrice!, currentFilter.maxPrice!];
    }

    if (currentFilter.minDate && currentFilter.maxDate) {
      this.rangeDates = [
        this.orderService.formatDateToLocale(currentFilter.minDate),
        this.orderService.formatDateToLocale(currentFilter.maxDate),
      ];
    }

    if (currentFilter.deliveryStatus) {
      this.selectedStatus = this.deliveryStatus.find(
        (status) => status.code == currentFilter.deliveryStatus,
      )!;
    }

    if (currentFilter.itemsToShow) {
      this.totalItemsToShow.set(currentFilter.itemsToShow!);
      this.config.itemsPerPage = currentFilter.itemsToShow;
    }

    if (currentFilter.page) {
      this.config.currentPage = currentFilter.page!;
    }

    const newRouteQueries = Object.fromEntries(
      Object.entries(this.orderService.createRouteQuery(currentFilter)).filter(
        ([_, value]) => value !== undefined,
      ),
    );

    this.filter.set({ ...this.filter, ...currentFilter });

    this.router.navigate([], {
      queryParams: newRouteQueries,
      relativeTo: this.route,
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

  itemsToShowChange(total: number) {
    this.config.itemsPerPage = total;
    this.totalItemsToShow.set(total);
    this.isLoading.set(true);
    this.filter.set({ ...this.filter(), page: 1, itemsToShow: total });
    this.updateQueries({ itemsToShow: total });
  }

  onRangeValueChanged(value: any[]) {
    this.updateQueries({ minPrice: value[0], maxPrice: value[1] });
  }

  searchChanged(value: any) {
    this.isLoading.set(true);
    this.filter.set({ ...this.filter(), search: value });
    this.updateQueries({ search: value });
  }

  onDateChanged() {
    if (this.rangeDates[0] && this.rangeDates[1]) {
      let dates = [...this.rangeDates];
      dates = dates.map((date) => this.orderService.formatDate(date));
      this.updateQueries({ page: 1, minDate: dates[0], maxDate: dates[1] });
    }
  }

  onChangeOrderStatus(status: { name: string; code: string }) {
    this.selectedStatus = status;
    this.updateQueries({ page: 1, deliveryStatus: status.code });
  }

  onClearFilter() {
    if (this.filterNumber == 0) {
      return;
    }
    this.menu.hide();
    this.onReturn();
  }

  onViewOrder(order: IOrder) {
    this.orderService.activeOrder.set(order);
    this.router.navigate(['/', 'admin', 'orders', order.id]);
  }

  updateQueries(updates: Partial<IOrderFilter>) {
    this.orderService.orderSignal.set(null);
    this.holdFilter.set({ ...this.holdFilter(), ...updates });
    sessionStorage.setItem(
      this.orderService.ORDER_QUERY_STORED_KEY,
      JSON.stringify(this.holdFilter()),
    );
    this.router.navigate([], {
      queryParams: this.orderService.createRouteQuery(this.filter()),
      relativeTo: this.route,
    });
  }

  onApplyFilter() {
    this.isLoading.set(true);
    this.filter.set({ ...this.holdFilter() });
    this.filterNumber = this.orderService.findFilterNumber(this.filter());
    sessionStorage.setItem(
      this.orderService.ORDER_QUERY_STORED_KEY,
      JSON.stringify(this.filter()),
    );
    this.router.navigate([], {
      queryParams: this.orderService.createRouteQuery(this.filter()),
      relativeTo: this.route,
    });
    this.menu.hide();
  }

  onReturn() {
    this.rangeDates = [];
    this.rangeValues = [2000, 10000];
    sessionStorage.removeItem(this.orderService.ORDER_QUERY_STORED_KEY);
    this.filterNumber = 0;
    this.orderService.orderQueried.set(false);
    this.router.navigate([], {
      queryParams: null,
      queryParamsHandling: 'replace',
      relativeTo: this.route,
    });
    this.isLoading.set(true);
    this.orderService.orderSignal.set(null);
    this.filter.set({
      itemsToShow: 10,
      page: 1,
    });
    this.holdFilter.set({ ...this.filter() });
    // this.searchInput.reset();
  }

  sortTable(column: any): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortUsed = true;

    this.orderData().orders.sort((a: any, b: any) => {
      let valueA, valueB;
      if (column == 'user') {
        valueA = a[column].name;
        valueB = b[column].name;
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
