import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChild,
  input,
  OnInit,
  output,
  TemplateRef,
} from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs';

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    SkeletonModule,
  ],
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericTableComponent implements OnInit {
  @ContentChild('headers') headers!: TemplateRef<any>;
  @ContentChild('rows') rows!: TemplateRef<any>;
  title = input<string>();
  data = input<any>();
  tableData = input.required<any[]>();
  itemsToShowInput = input<number>(10);
  searchValueInput = input<string>();
  showFilters = input<boolean>(true);
  showTotalItemFilter = input<boolean>(true);
  scrollTop = input<boolean>(true);
  parentInjected = input(false);
  searchInput: FormControl = new FormControl(null);
  itemsToShow: number[] = [10, 15, 20, 25];
  totalItemsToShow = computed(() => this.itemsToShowInput());
  pageChanged = output<number>();
  itemsToShowChanged = output<number>();
  searchValueEmit = output<string | null>();
  config = computed(() => ({
    id: 'adminPagination',
    itemsPerPage: Math.max(
      this.data()?.totalItemsInPage!,
      this.totalItemsToShow(),
    ),
    currentPage: this.data()?.currentPage!,
    totalItems: this.data()?.totalItems,
  }));

  ngOnInit() {
    if (this.searchValueInput()) {
      this.searchInput.setValue(this.searchValueInput());
    }
    this.searchInput.valueChanges
      .pipe(
        filter(Boolean),
        debounceTime(500),
        distinctUntilChanged(),
        map((value) => value.toLowerCase()),
      )
      .subscribe((value) => {
        this.searchValueEmit.emit(value);
      });
  }

  onChangeItemsToShow(total: number) {
    this.itemsToShowChanged.emit(total);
  }

  onClearSearch() {
    this.searchInput.reset();
    this.searchValueEmit.emit(null);
  }

  pageChange(event: any) {
    if (this.scrollTop()) {
      window.scrollTo({
        top: 70,
        behavior: 'smooth',
      });
    }
    this.pageChanged.emit(event);
  }
}
