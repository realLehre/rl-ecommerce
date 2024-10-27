import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { OrderStatusIconDirective } from './directives/order-status-icon.directive';
import { IDeliveryEvents } from '../../../../../shared/models/order.interface';
import { DeliveryEventRemarkPipe } from './pipes/delivery-event-remark.pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-tracker',
  standalone: true,
  imports: [OrderStatusIconDirective, DeliveryEventRemarkPipe, DatePipe],
  templateUrl: './order-tracker.component.html',
  styleUrl: './order-tracker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderTrackerComponent {
  trackingEvents = input<IDeliveryEvents[]>();
}
