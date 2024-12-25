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
import { catchError, of, switchMap, tap } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastService } from '../../../../shared/services/toast.service';

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
  isError = signal(false);
  private params = this.route.params;
  orderId = toSignal(this.params);
  private toast = inject(ToastService);
  refreshCounter = signal(0);
  private orderTrigger = computed(() => ({
    id: this.orderId()!['id'],
    refresh: this.refreshCounter(),
  }));
  order = toSignal(
    toObservable(this.orderTrigger).pipe(
      switchMap(({ id }) =>
        this.orderService.getOrderById(id).pipe(
          catchError((error) => {
            this.isLoading.set(false);
            this.toast.showToast({
              type: 'error',
              message: error.message || 'Failed to load order',
            });
            this.isError.set(true);
            return of(null);
          }),
        ),
      ),
      tap(() => this.isLoading.set(false)),
    ),
  );

  onStatusUpdated($event: IOrder) {
    this.orderService.activeOrder.set(null);
    this.resetState();
    this.refreshCounter.update((count) => count + 1);
  }

  onRetryLoad() {
    this.resetState();
    this.refreshCounter.update((count) => count + 1);
  }

  resetState() {
    this.orderService.activeOrder.set(null);
    this.isError.set(false);
    this.isLoading.set(true);
  }
}
