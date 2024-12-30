import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import {
  AdminUserService,
  IAdminUserFilter,
  IUserRes,
} from './admin-user.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { GenericTableComponent } from '../../../shared/components/generic-table/generic-table.component';
import { PaginationInstance } from 'ngx-pagination';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { CalendarModule } from 'primeng/calendar';
import { DatePipe, NgClass } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { SkeletonModule } from 'primeng/skeleton';
import { SliderModule } from 'primeng/slider';
import { ToastService } from '../../../shared/services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from '../../auth/services/auth.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    GenericTableComponent,
    CalendarModule,
    DatePipe,
    DropdownModule,
    MenuModule,
    SkeletonModule,
    SliderModule,
    NgClass,
  ],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUsersComponent implements OnInit {
  private userService = inject(AdminUserService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  userDataQueried = this.userService.userDataQueried;
  refresh = signal(0);
  isLoading = signal(true);
  isError = signal(false);
  filter = signal<IAdminUserFilter>({
    page: 1,
    pageSize: 10,
  });
  pageSize = signal(10);
  refreshTrigger = computed(() => ({
    filter: this.filter(),
    refresh: this.refresh(),
  }));
  private users$: Observable<IUserRes | any> = toObservable(
    this.refreshTrigger,
  ).pipe(
    switchMap(({ filter }) =>
      this.userService.getUsers(filter).pipe(
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
    tap(() => {
      this.saveQuery();
      this.isLoading.set(false);
    }),
  );
  userData: Signal<IUserRes> = toSignal(this.users$);
  sortUsed: boolean = false;
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit() {
    const savedQuery = JSON.parse(
      sessionStorage.getItem(this.userService.USER_QUERY_STORE_KEY)!,
    );
    if (savedQuery) {
      this.filter.set({ ...savedQuery });
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.userService.createRouteQuery(
        savedQuery ?? this.filter(),
      ),
      queryParamsHandling: 'merge',
    });
  }

  pageSizeChange($event: number) {
    this.userService.userDataSignal.set(undefined);
    this.filter.set({ ...this.filter(), pageSize: $event });
    this.pageSize.set($event);
    this.saveQuery();
    this.updateViewState();
  }

  pageChange($event: number) {
    this.userService.userDataSignal.set(undefined);
    this.filter.set({ ...this.filter(), page: $event });
    this.saveQuery();
    this.updateViewState();
  }

  searchChanged($event: string | null) {
    this.userService.userDataSignal.set(undefined);
    this.filter.set({ ...this.filter(), search: $event! });
    this.saveQuery();
    this.updateViewState();
  }

  onReturn() {
    this.filter.set({ page: 1, pageSize: 10 });
    this.userService.userDataSignal.set(undefined);
    sessionStorage.removeItem(this.userService.USER_QUERY_STORE_KEY);
    this.saveQuery();
    this.updateViewState();
  }

  saveQuery() {
    sessionStorage.setItem(
      this.userService.USER_QUERY_STORE_KEY,
      JSON.stringify(this.filter()),
    );
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.userService.createRouteQuery(this.filter()),
      queryParamsHandling: 'merge',
    });
  }

  updateViewState() {
    this.isLoading.set(true);
    this.refresh.update((count) => count + 1);
  }

  sortTable(column: any): void {
    const { sortedData, sortDirection, sortUsed } = this.userService.sortTable(
      column,
      this.userData(),
    );
    this.users$ = of(sortedData);
    this.sortDirection = sortDirection;
    this.sortUsed = sortUsed;
  }

  onViewUser(user: IUser) {
    this.router.navigate(['/', 'admin', 'users', user.id]);
  }
}
