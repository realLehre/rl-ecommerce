import { Component, computed, inject, input } from '@angular/core';
import { User } from '@prisma/client';
import { AdminUserService, IAdminSingleUser } from '../admin-user.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { IOrder } from '../../../../shared/models/order.interface';
import { SkeletonModule } from 'primeng/skeleton';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-user-details',
  standalone: true,
  imports: [CurrencyPipe, SkeletonModule, DatePipe, RouterLink],
  templateUrl: './admin-user-details.component.html',
  styleUrl: './admin-user-details.component.scss',
})
export class AdminUserDetailsComponent {
  private readonly userService = inject(AdminUserService);
  id = input.required<string>();
  user$ = toObservable(this.id).pipe(
    switchMap((id) => this.userService.getUserById(id)),
  );
  userData = toSignal<IAdminSingleUser>(this.user$);
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
