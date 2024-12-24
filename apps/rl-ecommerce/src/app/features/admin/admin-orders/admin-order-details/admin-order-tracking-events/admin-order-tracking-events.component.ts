import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IDeliveryEvents } from '../../../../../shared/models/order.interface';
import { DatePipe, NgClass } from '@angular/common';
import { DeliveryEventRemarkPipe } from '../../../../user/user-orders/user-order-details/order-tracker/pipes/delivery-event-remark.pipe';
import {
  OrderStatusIconDirective,
  OrderStatusLine,
} from '../../../../user/user-orders/user-order-details/order-tracker/directives/order-status-icon.directive';

@Component({
  selector: 'app-admin-order-tracking-events',
  standalone: true,
  imports: [
    DatePipe,
    DeliveryEventRemarkPipe,
    OrderStatusIconDirective,
    NgClass,
    OrderStatusLine,
  ],
  templateUrl: './admin-order-tracking-events.component.html',
  styleUrl: './admin-order-tracking-events.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminOrderTrackingEventsComponent {
  trackingEvents = input<IDeliveryEvents[]>();
}
