import {
  Component,
  ContentChild,
  inject,
  input,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { AdminProductsService } from '../../../features/admin/admin-products/services/admin-products.service';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { IProduct } from '../../../features/products/model/product.interface';
import { NgxPaginationModule, PaginationInstance } from 'ngx-pagination';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
  ],
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.scss',
})
export class GenericTableComponent {
  @ContentChild('headers') headers!: TemplateRef<any>;
  @ContentChild('rows') rows!: TemplateRef<any>;
  title = input.required<string>();
  data = input.required<any>();
  config: PaginationInstance = {
    id: 'userOrderPagination',
    itemsPerPage: 10,
    currentPage: 1,
  };
  searchInput: FormControl = new FormControl(null);
  itemsToShow: number[] = [1, 5, 10, 15, 20, 25];
  totalItemsToShow: number = 10;

  onChangeItemsToShow(total: number) {
    this.totalItemsToShow = total;
    this.config.itemsPerPage = total;
  }

  pageChange(event: any) {
    window.scrollTo({
      top: 70,
      behavior: 'smooth',
    });
  }
}
