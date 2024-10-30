import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { ActivatedRoute } from '@angular/router';
import { OrderTrackerComponent } from './order-tracker/order-tracker.component';
import { GenericOrderSummaryComponent } from '../../../../shared/components/generic-order-summary/generic-order-summary.component';
import { OrderService } from '../../../../shared/services/order.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-user-order-details',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    OrderTrackerComponent,
    GenericOrderSummaryComponent,
    DatePipe,
    CurrencyPipe,
    SkeletonModule,
  ],
  templateUrl: './user-order-details.component.html',
  styleUrl: './user-order-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserOrderDetailsComponent {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  order = this.orderService.activeOrder;
  id: string = '';
  constructor() {
    this.route.params.subscribe((param) => {
      this.id = param['id'];
      if (!this.order()) {
        this.orderService.getOrderById(this.id).subscribe({
          next: (res) => {
            this.order.set(res);
          },
        });
      }
    });
  }

  loadOrderDetails(event: any) {
    this.order.set(null);
    this.orderService.orderSignal.set(null);
    this.orderService.getOrderById(this.id).subscribe({
      next: (res) => {
        this.order.set(res);
      },
    });
  }
}
