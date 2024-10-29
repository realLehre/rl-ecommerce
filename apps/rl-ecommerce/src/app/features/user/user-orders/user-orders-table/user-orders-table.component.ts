import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { NgxPaginationModule, PaginationInstance } from 'ngx-pagination';
import { Router, RouterLink } from '@angular/router';
import { OrderStatusDirective } from '../../../../shared/directives/order-status.directive';
import {
  IOrder,
  IOrderResponse,
} from '../../../../shared/models/order.interface';
import { SubtotalPipe } from '../../../../shared/pipes/subtotal.pipe';
import { SkeletonModule } from 'primeng/skeleton';
import { OrderService } from '../../../../shared/services/order.service';
import { ToastService } from '../../../../shared/services/toast.service';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
} from 'rxjs';
import { Menu, MenuModule } from 'primeng/menu';
import { PrimeTemplate } from 'primeng/api';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { SliderModule } from 'primeng/slider';
import { CalendarModule } from 'primeng/calendar';
import { NumberOfFiltersPipe } from '../../../../shared/pipes/number-of-filters.pipe';

@Component({
  selector: 'app-user-orders-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    RouterLink,
    OrderStatusDirective,
    SubtotalPipe,
    SkeletonModule,
    ReactiveFormsModule,
    MenuModule,
    PrimeTemplate,
    DropdownModule,
    LoaderComponent,
    SliderModule,
    CalendarModule,
    NumberOfFiltersPipe,
  ],
  templateUrl: './user-orders-table.component.html',
  styleUrl: './user-orders-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserOrdersTableComponent implements OnInit {
  private orderService = inject(OrderService);
  private router = inject(Router);
  private toast = inject(ToastService);
  orders!: IOrderResponse;
  isLoading = signal(true);

  orderQueried = this.orderService.orderQueried;
  sortUsed: boolean = false;
  sortColumn: keyof IOrder | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  itemsToShow: number[] = [1, 5, 10, 15, 20, 25];
  totalItemsToShow: number = 10;
  config: PaginationInstance = {
    id: 'userOrderPagination',
    itemsPerPage: 10,
    currentPage: 1,
  };
  filter: {
    minPrice?: number;
    maxPrice?: number;
    deliveryStatus?: string;
    itemsToShow: number;
    page?: number;
    orderId?: string;
    minDate?: any;
    maxDate?: any;
  } = {
    itemsToShow: this.totalItemsToShow,
    page: 1,
  };
  searchInput: FormControl = new FormControl(null);
  deliveryStatus: { name: string; code: string }[] = [
    { name: 'Pending', code: 'PENDING' },
    { name: 'Packed', code: 'PACKED' },
    { name: 'Delivered', code: 'DELIVERED' },
  ];
  selectedStatus!: { name: string; code: string };
  rangeValues = [2000, 10000];
  rangeValueChanged = signal(false);
  rangeDates: any[] = [];
  FILTER_STORAGE_KEY = 'sjs29shdndj20snshgff7';
  @ViewChild('menu') menu!: Menu;
  filterNumber = 0;

  ngOnInit() {
    const storedFilter = JSON.parse(
      sessionStorage.getItem(this.FILTER_STORAGE_KEY)!,
    );
    if (storedFilter) {
      this.filter = storedFilter;
      if (this.filter.minPrice && this.filter.maxPrice) {
        this.rangeValues = [this.filter.minPrice, this.filter.maxPrice];
      }
      if (this.filter.deliveryStatus) {
        this.selectedStatus = this.deliveryStatus.find(
          (status) => status.code == this.filter.deliveryStatus,
        )!;
      }
      if (this.filter.minDate && this.filter.maxDate) {
        const minDate = this.orderService.formatDateToLocale(
          this.filter.minDate,
        );
        const maxDate = this.orderService.formatDateToLocale(
          this.filter.maxDate,
        );
        this.rangeDates = [minDate, maxDate];
      }

      this.filterNumber = this.findFilterNumber();
    }
    this.getOrder();
    this.searchInput.valueChanges
      .pipe(filter(Boolean), debounceTime(500), distinctUntilChanged())
      .subscribe((val) => {
        this.filter = { ...this.filter, orderId: val };
        this.reFetchOrder();
      });
  }

  getOrder() {
    this.isLoading.set(true);
    sessionStorage.setItem(
      this.FILTER_STORAGE_KEY,
      JSON.stringify(this.filter),
    );

    this.orderService.getOrder(this.filter).subscribe({
      next: (res) => {
        this.orders = res!;
        this.totalItemsToShow = Math.max(
          res?.totalItemsInPage!,
          this.totalItemsToShow,
        );
        this.config.totalItems = res?.totalItemsInPage!;
        this.config.currentPage = res?.currentPage!;
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toast.showToast({
          type: 'error',
          message: err.error.message,
        });
      },
    });
  }

  onViewOrder(order: IOrder) {
    this.orderService.activeOrder.set(order);

    this.router.navigate(['/', 'orders', order.id]);
  }

  onChangeItemsToShow(total: number) {
    this.filter = { ...this.filter, page: 1, itemsToShow: total };
    this.totalItemsToShow = total;
    this.reFetchOrder();
  }

  onChangeOrderStatus(status: { name: string; code: string }) {
    this.selectedStatus = status;

    this.filter = { ...this.filter, page: 1, deliveryStatus: status.code };
  }

  onRangeValueChanged(value: any[]) {
    this.filter = {
      ...this.filter,
      minPrice: value[0],
      maxPrice: value[1],
    };
  }

  pageChange(event: any) {
    this.filter = { ...this.filter, page: event };
    this.reFetchOrder();
    window.scrollTo({
      top: 70,
      behavior: 'smooth',
    });
  }

  onDateChanged() {
    if (this.rangeDates[0] && this.rangeDates[1]) {
      let dates = [...this.rangeDates];
      dates = dates.map((date) => this.orderService.formatDate(date));
      this.filter = {
        ...this.filter,
        page: 1,
        minDate: dates[0],
        maxDate: dates[1],
      };
    }
  }

  onApplyFilter() {
    this.filterNumber = this.findFilterNumber();
    this.reFetchOrder();
    this.menu.hide();
  }

  onReturn() {
    this.filter = {
      itemsToShow: this.totalItemsToShow,
      page: 1,
    };
    this.rangeDates = [];
    sessionStorage.removeItem(this.FILTER_STORAGE_KEY);
    this.filterNumber = 0;
    this.searchInput.reset();
    this.reFetchOrder();
  }

  onClearFilter() {
    if (this.filterNumber == 0) {
      return;
    }
    this.onReturn();
    this.menu.hide();
    this.rangeValues = [2000, 10000];
  }

  reFetchOrder() {
    this.orderService.orderSignal.set(null);
    this.getOrder();
  }

  findFilterNumber() {
    let number = 0;
    for (const key in this.filter) {
      if (key == 'deliveryStatus' || key == 'minDate' || key == 'minPrice') {
        number += 1;
      }
    }
    return number;
  }

  sortTable(column: keyof IOrder): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortUsed = true;

    this.orders?.orders?.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;

      return 0;
    });
  }
}
