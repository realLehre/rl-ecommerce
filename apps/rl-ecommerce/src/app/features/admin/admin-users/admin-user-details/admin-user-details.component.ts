import { Component, inject, input } from '@angular/core';
import { User } from '@prisma/client';
import { AdminUserService } from '../admin-user.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-admin-user-details',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './admin-user-details.component.html',
  styleUrl: './admin-user-details.component.scss',
})
export class AdminUserDetailsComponent {
  private readonly userService = inject(AdminUserService);
  id = input.required<string>();
  user$ = toObservable(this.id).pipe(
    switchMap((id) => this.userService.getUserById(id)),
  );
  userData = toSignal(this.user$);
}
