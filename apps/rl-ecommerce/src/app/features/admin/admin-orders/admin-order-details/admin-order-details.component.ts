import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminOrderSummaryComponent } from './admin-order-summary/admin-order-summary.component';
import { AdminOrderCustomerInfoComponent } from './admin-order-customer-info/admin-order-customer-info.component';
import { IOrder } from '../../../../shared/models/order.interface';
import { AdminOrderStatusComponent } from './admin-order-status/admin-order-status.component';

@Component({
  selector: 'app-admin-order-details',
  standalone: true,
  imports: [
    RouterLink,
    AdminOrderSummaryComponent,
    AdminOrderCustomerInfoComponent,
    AdminOrderStatusComponent,
  ],
  templateUrl: './admin-order-details.component.html',
  styleUrl: './admin-order-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminOrderDetailsComponent {
  order: IOrder = JSON.parse(localStorage.getItem('testorder')!);
}
