import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IOrder } from '../../../../../shared/models/order.interface';

@Component({
  selector: 'app-admin-order-customer-info',
  standalone: true,
  imports: [],
  templateUrl: './admin-order-customer-info.component.html',
  styleUrl: './admin-order-customer-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminOrderCustomerInfoComponent {
  order = input<IOrder>({} as IOrder);
}
