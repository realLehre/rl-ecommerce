import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { AdminOrderSummaryComponent } from './admin-order-summary/admin-order-summary.component';
import { AdminOrderCustomerInfoComponent } from './admin-order-customer-info/admin-order-customer-info.component';
import { IOrder } from '../../../../shared/models/order.interface';
import { AdminOrderStatusComponent } from './admin-order-status/admin-order-status.component';
import { AdminOrderService } from '../services/admin-order.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { of, switchMap, tap } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-admin-order-details',
  standalone: true,
  imports: [
    RouterLink,
    AdminOrderSummaryComponent,
    AdminOrderCustomerInfoComponent,
    AdminOrderStatusComponent,
    SkeletonModule,
  ],
  templateUrl: './admin-order-details.component.html',
  styleUrl: './admin-order-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminOrderDetailsComponent {
  private orderService = inject(AdminOrderService);
  private route = inject(ActivatedRoute);
  isLoading = signal(true);
  private params = this.route.params;
  orderId = toSignal(this.params);
  refreshCounter = signal(0);
  private orderTrigger = computed(() => ({
    id: this.orderId()!['id'],
    refresh: this.refreshCounter(),
  }));
  order = toSignal(
    toObservable(this.orderTrigger).pipe(
      tap(() => this.isLoading.set(true)),
      switchMap(({ id }) => this.orderService.getOrderById(id)),
      tap(() => this.isLoading.set(false)),
    ),
  );

  onStatusUpdated($event: IOrder) {
    this.orderService.activeOrder.set(null);
    this.orderService.orderSignal.set(null);
    this.refreshCounter.update((count) => count + 1);
  }
}
