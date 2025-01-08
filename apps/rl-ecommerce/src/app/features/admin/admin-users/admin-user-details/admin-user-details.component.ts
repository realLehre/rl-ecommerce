import { Component, computed, inject, input, signal } from '@angular/core';
import { AdminUserService, IAdminSingleUser } from '../admin-user.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap, tap } from 'rxjs';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { IOrder } from '../../../../shared/models/order.interface';
import { SkeletonModule } from 'primeng/skeleton';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-admin-user-details',
  standalone: true,
  imports: [CurrencyPipe, SkeletonModule, DatePipe, RouterLink],
  templateUrl: './admin-user-details.component.html',
  styleUrl: './admin-user-details.component.scss',
})
export class AdminUserDetailsComponent {
  private readonly userService = inject(AdminUserService);
  private toast = inject(ToastService);
  id = input.required<string>();
  isLoading = signal(true);
  isError = signal(false);
  errorMessage = signal(undefined);
  userData = toSignal<IAdminSingleUser | any>(
    toObservable(this.id).pipe(
      switchMap((id) =>
        this.userService.getUserById(id).pipe(
          catchError((err: any) => {
            this.toast.showToast({ type: 'error', message: err.error.message });
            this.errorMessage.set(err.error.message);
            this.isLoading.set(false);
            this.isError.set(true);
            return of(null);
          }),
        ),
      ),
      tap(() => this.isLoading.set(false)),
    ),
  );
  userShoppingData = computed(() => {
    const totalSpent = this.userData()?.orders.reduce(
      (acc: number, order: IOrder) => {
        return (acc += order.totalAmount);
      },
      0,
    );
    const totalOrders = this.userData()?.orders.length;
    return {
      totalSpent,
      totalOrders,
    };
  });
}
