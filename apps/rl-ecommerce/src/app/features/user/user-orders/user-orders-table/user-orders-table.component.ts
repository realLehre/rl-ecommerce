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
import { MenuModule } from 'primeng/menu';
import { PrimeTemplate } from 'primeng/api';

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
  selectedStatus = 'ALL';
  orderQueried = this.orderService.orderQueried;
  sortUsed: boolean = false;
  sortColumn: keyof IOrder | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  itemsToShow: number[] = [1, 5, 10, 15, 20, 25];
  totalItemsToShow: number = 5;
  config = this.orderService.paginationConfig;
  filter: {
    minPrice?: number;
    maxPrice?: number;
    deliveryStatus?: string;
    itemsToShow: number;
    page?: number;
    orderId?: string;
  } = {
    minPrice: undefined,
    maxPrice: undefined,
    deliveryStatus: undefined,
    itemsToShow: this.totalItemsToShow,
    page: 1,
  };
  searchInput: FormControl = new FormControl(null);
  deliveryStatus = [
    { name: 'Pending', code: 'PENDING' },
    { name: 'Packed', code: 'PACKED' },
    { name: 'Delivered', code: 'DELIVERED' },
  ];

  ngOnInit() {
    this.getOrder();
    this.searchInput.valueChanges
      .pipe(filter(Boolean), debounceTime(500), distinctUntilChanged())
      .subscribe((val) => {
        this.filter = { ...this.filter, orderId: val };
        this.refetchOrder();
      });
  }

  getOrder() {
    this.isLoading.set(true);
    this.orderService.getOrder(this.filter).subscribe({
      next: (res) => {
        this.orders = res!;
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

  searchOrder() {
    // fromEvent(this.orderSearch.nativeElement, 'keyup')
    //   .pipe(
    //     filter(Boolean),
    //     debounceTime(500),
    //     distinctUntilChanged(),
    //     map((data) => this.orderSearch.nativeElement.value),
    //   )
    //   .subscribe((val) => {
    //     this.filter = { ...this.filter, orderId: val };
    //     this.refetchOrder();
    //   });
  }

  onViewOrder(order: IOrder) {
    this.orderService.activeOrder.set(order);

    this.router.navigate(['/', 'orders', order.id]);
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

  onChangeItemsToShow(total: number) {
    this.filter = { ...this.filter, page: 1, itemsToShow: total };
    this.totalItemsToShow = total;
    this.refetchOrder();
  }

  onChangeOrderStatus(status: string) {
    this.selectedStatus = status;
    if (status === 'ALL') {
      this.filter = { ...this.filter, page: 1, deliveryStatus: undefined };
    } else {
      this.filter = { ...this.filter, page: 1, deliveryStatus: status };
    }
    this.refetchOrder();
    console.log(status);
  }

  pageChange(event: any) {
    this.filter = { ...this.filter, page: event };
    this.refetchOrder();
    window.scrollTo({
      top: 70,
      behavior: 'smooth',
    });
  }

  onReturn() {
    this.filter = {
      minPrice: undefined,
      maxPrice: undefined,
      deliveryStatus: undefined,
      itemsToShow: this.totalItemsToShow,
      page: 1,
    };
    this.searchInput.reset();
    this.refetchOrder();
  }

  refetchOrder() {
    this.orderService.orderSignal.set(null);
    this.getOrder();
  }
}
