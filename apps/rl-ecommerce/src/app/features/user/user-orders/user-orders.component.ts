import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { UserOrdersTableComponent } from './user-orders-table/user-orders-table.component';
import { OrderService } from '../../../shared/services/order.service';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [BreadcrumbComponent, UserOrdersTableComponent, AsyncPipe],
  templateUrl: './user-orders.component.html',
  styleUrl: './user-orders.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserOrdersComponent {
  private orderService = inject(OrderService);
  // orders: Observable<any> = this.orderService.getOrder();
}
