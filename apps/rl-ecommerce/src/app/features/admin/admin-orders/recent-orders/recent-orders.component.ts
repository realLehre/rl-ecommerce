import { Component, inject, OnInit } from '@angular/core';
import { AdminOrderService } from '../services/admin-order.service';
import { GenericTableComponent } from '../../../../shared/components/generic-table/generic-table.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkeletonModule } from 'primeng/skeleton';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { OrderStatusDirective } from '../../../../shared/directives/order-status.directive';
import { IOrder } from '../../../../shared/models/order.interface';

@Component({
  selector: 'app-recent-orders',
  standalone: true,
  imports: [
    GenericTableComponent,
    SkeletonModule,
    CurrencyPipe,
    DatePipe,
    OrderStatusDirective,
  ],
  templateUrl: './recent-orders.component.html',
  styleUrl: './recent-orders.component.scss',
})
export class RecentOrdersComponent implements OnInit {
  private readonly orderService = inject(AdminOrderService);
  ordersData = toSignal(this.orderService.getRecentOrders());
  ngOnInit() {
    this.orderService.getRecentOrders().subscribe();
  }

  onViewOrder(order: IOrder) {}
}
