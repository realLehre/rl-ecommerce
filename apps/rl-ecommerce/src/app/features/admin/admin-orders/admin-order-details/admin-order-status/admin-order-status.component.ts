import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  ViewChild,
} from '@angular/core';
import { IOrder } from '../../../../../shared/models/order.interface';
import { FormsModule } from '@angular/forms';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { OrderTrackerComponent } from '../../../../user/user-orders/user-order-details/order-tracker/order-tracker.component';
import { AdminOrderTrackingEventsComponent } from '../admin-order-tracking-events/admin-order-tracking-events.component';
import { OrderStatusText } from '../../../../user/user-orders/user-order-details/order-tracker/directives/order-status-icon.directive';

@Component({
  selector: 'app-admin-order-status',
  standalone: true,
  imports: [
    FormsModule,
    DropdownModule,
    OrderTrackerComponent,
    AdminOrderTrackingEventsComponent,
    OrderStatusText,
  ],
  templateUrl: './admin-order-status.component.html',
  styleUrl: './admin-order-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminOrderStatusComponent {
  order = input<IOrder>({} as IOrder);
  deliveryStatus: { name: string; code: string }[] = [
    { name: 'Packed', code: 'PACKED' },
    { name: 'Delivered', code: 'DELIVERED' },
  ];
  selectedStatus!: { name: string; code: string };
  @ViewChild('dropDown') dropDown!: Dropdown;

  onToggleDropDown() {
    this.dropDown.show();
  }

  onChangeOrderStatus(event: any) {}
}
