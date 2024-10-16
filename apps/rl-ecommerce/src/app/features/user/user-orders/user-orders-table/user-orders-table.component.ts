import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule, PaginationInstance } from 'ngx-pagination';
import { IOrder, UserOrdersService } from '../services/user-orders.service';
import { RouterLink } from '@angular/router';
import { OrderStatusDirective } from '../../../../shared/directives/order-status.directive';

@Component({
  selector: 'app-user-orders-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    RouterLink,
    OrderStatusDirective,
  ],
  templateUrl: './user-orders-table.component.html',
  styleUrl: './user-orders-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserOrdersTableComponent {
  private orderService = inject(UserOrdersService);
  orders: IOrder[] = this.orderService.orders;

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

  ngOnInit() {}

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

    this.orders.sort((a, b) => {
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
