import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { OrderStatusIconDirective } from './directives/order-status-icon.directive';

@Component({
  selector: 'app-order-tracker',
  standalone: true,
  imports: [OrderStatusIconDirective],
  templateUrl: './order-tracker.component.html',
  styleUrl: './order-tracker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderTrackerComponent implements OnInit {
  timeLine: { label: string; date: string; isComplete: boolean }[] = [
    { label: 'Verified', date: 'July 23, 2024', isComplete: true },
    { label: 'Confirmed', date: 'Waiting...', isComplete: false },
    { label: 'Packed', date: 'Waiting...', isComplete: false },
    { label: 'Delivered', date: 'Waiting...', isComplete: false },
  ];

  ngOnInit() {}
}
