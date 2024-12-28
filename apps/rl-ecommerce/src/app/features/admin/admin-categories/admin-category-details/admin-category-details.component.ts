import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { AdminCategoriesService } from '../services/admin-categories.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { Categories } from '../admin-categories.interface';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-admin-category-details',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './admin-category-details.component.html',
  styleUrl: './admin-category-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCategoryDetailsComponent {
  private categoryService = inject(AdminCategoriesService);
  private toast = inject(ToastService);
  id = input.required<string>();
  isLoading = signal(true);
  isError = signal(false);
  refreshTrigger = signal(0);
  refresh = computed(() => ({
    id: this.id(),
    refresh: this.refreshTrigger(),
  }));
  category$: Observable<Categories | any> = toObservable(this.refresh).pipe(
    switchMap(({ id }) =>
      this.categoryService.getCategoryById(id).pipe(
        catchError((error) => {
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
  categoryData = toSignal(this.category$);
}
