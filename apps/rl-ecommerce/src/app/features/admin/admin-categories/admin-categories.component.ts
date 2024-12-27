import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Signal,
  signal,
} from '@angular/core';
import { AdminCategoriesService } from './services/admin-categories.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { ToastService } from '../../../shared/services/toast.service';
import { DatePipe, NgClass } from '@angular/common';
import { GenericTableComponent } from '../../../shared/components/generic-table/generic-table.component';
import { SkeletonModule } from 'primeng/skeleton';
import { PaginationInstance } from 'ngx-pagination';
import { IAdminUserFilter } from '../admin-users/admin-user.service';
import { ICategory, IProduct } from '../../products/model/product.interface';
import { IAdminCategoriesResponse } from './admin-categories.interface';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [DatePipe, GenericTableComponent, SkeletonModule, NgClass],
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCategoriesComponent {
  private categoryService = inject(AdminCategoriesService);
  private toast = inject(ToastService);
  config: PaginationInstance = {
    id: 'adminUsersPagination',
    itemsPerPage: 10,
    currentPage: 1,
  };
  categoriesDataQueried = this.categoryService.categoriesDataQueried;
  refreshTrigger = signal(0);
  filter = signal<IAdminUserFilter>({
    page: 1,
    itemsPerPage: 10,
  });
  refresh = computed(() => ({
    searchValue: this.filter(),
    refresh: this.refreshTrigger(),
  }));
  isError = signal(false);
  isLoading = signal(true);
  categories$: Observable<IAdminCategoriesResponse | any> = toObservable(
    this.refresh,
  ).pipe(
    switchMap(({ searchValue }) =>
      this.categoryService.getCategories(searchValue!).pipe(
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
  );
  categoriesData: Signal<IAdminCategoriesResponse> = toSignal(this.categories$);
  sortUsed: boolean = false;
  sortColumn: keyof IProduct | keyof ICategory | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  pageChange($event: number) {}

  itemsToShowChange($event: number) {}

  searchChanged($event: string | null) {}

  sortTable(column: any): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortUsed = true;

    this.categoriesData()?.categories.sort((a: any, b: any) => {
      let valueA, valueB;
      if (column == '_count') {
        valueA = a[column].products.toString();
        valueB = b[column].products.toString();
      } else {
        valueA = a[column];
        valueB = b[column];
      }

      if (valueA && valueB) {
        if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      }

      return 0;
    });
  }

  onViewUser(user: any) {}

  onReturn() {}

  updateViewState() {
    this.refreshTrigger.update((count) => count + 1);
  }
}
