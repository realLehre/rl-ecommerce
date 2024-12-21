import { Component, inject, OnInit } from '@angular/core';
import { AdminOrderService } from '../services/admin-order.service';

@Component({
  selector: 'app-recent-orders',
  standalone: true,
  imports: [],
  templateUrl: './recent-orders.component.html',
  styleUrl: './recent-orders.component.scss',
})
export class RecentOrdersComponent implements OnInit {
  private readonly orderService = inject(AdminOrderService);
  ngOnInit() {
    this.orderService.getRecentOrders().subscribe();
  }
}
