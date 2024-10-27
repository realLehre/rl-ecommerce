import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

  sortUsed: boolean = false;
  sortColumn: keyof IOrder | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  itemsToShow: number[] = [5, 10, 15, 20, 25];
  totalItemsToShow: number = 5;
  config: PaginationInstance = {
    id: 'digitizationPagination',
    itemsPerPage: 5,
    currentPage: 1,
  };

  ngOnInit() {
    this.orderService.getOrder().subscribe({
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

  onViewOrder(order: IOrder) {
    this.orderService.activeOrder.set(order);

    this.router.navigate(['/', 'orders', order.id]);
  }

  onChangeItemsToShow(total: number) {
    this.config.itemsPerPage = total;
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

  pageChange(event: any) {
    this.config.currentPage = event;
    window.scrollTo({
      top: 70,
      behavior: 'smooth',
    });
  }
}
