import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  Signal,
  signal,
  ViewChild,
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
import {
  Categories,
  IAdminCategoriesResponse,
} from './admin-categories.interface';
import { Menu, MenuModule } from 'primeng/menu';
import { PrimeTemplate } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Tooltip } from 'primeng/tooltip';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DeleteCategoryDialogComponent } from './dialogs/delete-category-dialog/delete-category-dialog.component';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [
    DatePipe,
    GenericTableComponent,
    SkeletonModule,
    NgClass,
    MenuModule,
    PrimeTemplate,
  ],
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCategoriesComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private categoryService = inject(AdminCategoriesService);
  private toast = inject(ToastService);
  config: PaginationInstance = {
    id: 'adminUsersPagination',
    itemsPerPage: 10,
    currentPage: 1,
  };
  totalItemsToShow = signal(10);
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
    tap((res) => {
      this.config.itemsPerPage = Math.max(
        res?.totalItemsInPage!,
        this.totalItemsToShow(),
      );
      this.config.currentPage = res?.currentPage!;
      this.config.totalItems = res?.totalItems;
      this.saveQuery();
      this.isLoading.set(false);
    }),
  );
  categoriesData: Signal<IAdminCategoriesResponse> = toSignal(this.categories$);
  subCategoriesToolTip = computed(() => ({
    subCategoryNames: this.categoriesData().categories.map(
      ({ subCategories }) => subCategories.map(({ name }) => name).join(', '),
    ),
  }));
  selectedCategory = signal<Categories | undefined>(undefined);
  sortUsed: boolean = false;
  sortColumn: keyof IProduct | keyof ICategory | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  @ViewChild('menu') actionMenu!: Menu;
  private ref: DynamicDialogRef | undefined;
  private dialogService = inject(DialogService);

  ngOnInit() {
    const savedQuery = JSON.parse(
      sessionStorage.getItem(this.categoryService.CATEGORIES_QUERY_STORE_KEY)!,
    );
    if (savedQuery) {
      this.filter.set({ ...savedQuery });
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.categoryService.createRouteQuery(
        savedQuery ?? this.filter(),
      ),
      queryParamsHandling: 'merge',
    });
  }

  itemsToShowChange($event: number) {
    this.categoryService.categoriesSignal.set(undefined);
    this.totalItemsToShow.set($event);
    this.filter.set({ ...this.filter(), itemsPerPage: $event });
    this.saveQuery();
    this.updateViewState();
  }

  pageChange($event: number) {
    this.categoryService.categoriesSignal.set(undefined);
    this.filter.set({ ...this.filter(), page: $event });
    this.saveQuery();
    this.updateViewState();
  }

  searchChanged($event: string | null) {
    this.categoryService.categoriesSignal.set(undefined);
    this.filter.set({ ...this.filter(), search: $event! });
    this.saveQuery();
    this.updateViewState();
  }
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

  updateViewState() {
    this.isLoading.set(true);
    this.refreshTrigger.update((count) => count + 1);
  }

  onOpenProductActionMenu(event: any, category: Categories) {
    this.actionMenu.show(event);
    this.selectedCategory.set(category);
  }

  onViewDetails() {
    this.router.navigate([
      '/',
      'admin',
      'categories',
      this.selectedCategory()?.id,
    ]);
  }

  onEdit() {
    this.categoryService.activeCategory.set(this.selectedCategory());
    sessionStorage.setItem(
      'ssjsiw72jsksdeisi92e',
      JSON.stringify(this.categoryService.activeCategory()),
    );
    this.router.navigate(['/', 'admin', 'add-category'], {
      queryParams: { edit: true },
    });
  }

  onDelete() {
    this.categoryService.activeCategory.set(this.selectedCategory());
    this.ref = this.dialogService.open(DeleteCategoryDialogComponent, {
      width: '25rem',
      breakpoints: {
        '450px': '90vw',
      },
      focusOnShow: false,
    });

    this.ref.onClose.subscribe((res) => {
      if (res == 'deleted') {
        this.categoryService.categoriesSignal.set(undefined);
        this.onReturn();
      }
    });
  }

  onReturn() {
    this.filter.set({ page: 1, itemsPerPage: 10 });
    sessionStorage.removeItem(this.categoryService.CATEGORIES_QUERY_STORE_KEY);
    this.saveQuery();
    this.updateViewState();
  }

  saveQuery() {
    sessionStorage.setItem(
      this.categoryService.CATEGORIES_QUERY_STORE_KEY,
      JSON.stringify(this.filter()),
    );
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.categoryService.createRouteQuery(this.filter()),
      queryParamsHandling: 'merge',
    });
  }
}
