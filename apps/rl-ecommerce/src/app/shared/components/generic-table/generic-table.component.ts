import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChild,
  inject,
  input,
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
export class GenericTableComponent {
  @ContentChild('headers') headers!: TemplateRef<any>;
  @ContentChild('rows') rows!: TemplateRef<any>;
  title = input.required<string>();
  data = input.required<any>();
  tableData = input.required<any[]>();
  config = input<PaginationInstance>();
  itemsToShowInput = input<number>(10);
  searchInput: FormControl = new FormControl(null);
  itemsToShow: number[] = [1, 5, 10, 15, 20, 25];
  totalItemsToShow = computed(() => this.itemsToShowInput());
  pageChanged = output<number>();
  itemsToShowChanged = output<number>();

  onChangeItemsToShow(total: number) {
    // this.totalItemsToShow.set(total)
    this.itemsToShowChanged.emit(total);
  }

  pageChange(event: any) {
    window.scrollTo({
      top: 70,
      behavior: 'smooth',
    });
    this.pageChanged.emit(event);
  }
}
