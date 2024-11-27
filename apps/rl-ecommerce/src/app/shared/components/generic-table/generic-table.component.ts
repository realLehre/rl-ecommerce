import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChild,
  inject,
  input,
  OnInit,
  output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { AdminProductsService } from '../../../features/admin/admin-products/services/admin-products.service';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { IProduct } from '../../../features/products/model/product.interface';
import { NgxPaginationModule, PaginationInstance } from 'ngx-pagination';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Menu } from 'primeng/menu';
import { SkeletonModule } from 'primeng/skeleton';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
} from 'rxjs';

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
  title = input.required<string>();
  data = input.required<any>();
  tableData = input.required<any[]>();
  config = input<PaginationInstance>();
  itemsToShowInput = input<number>(10);
  searchValueInput = input<string>();
  searchInput: FormControl = new FormControl(null);
  itemsToShow: number[] = [1, 5, 10, 15, 20, 25];
  totalItemsToShow = computed(() => this.itemsToShowInput());
  pageChanged = output<number>();
  itemsToShowChanged = output<number>();
  searchValueEmit = output<string | null>();

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
    // this.totalItemsToShow.set(total)
    this.itemsToShowChanged.emit(total);
  }

  onClearSearch() {
    this.searchInput.reset();
    this.searchValueEmit.emit(null);
  }

  pageChange(event: any) {
    window.scrollTo({
      top: 70,
      behavior: 'smooth',
    });
    this.pageChanged.emit(event);
  }
}
