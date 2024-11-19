import {
  Component,
  ContentChild,
  inject,
  input,
  TemplateRef,
} from '@angular/core';
import { AdminProductsService } from '../../../features/admin/admin-products/services/admin-products.service';
import { NgTemplateOutlet } from '@angular/common';
import { IProduct } from '../../../features/products/model/product.interface';
import { NgxPaginationModule, PaginationInstance } from 'ngx-pagination';

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [NgTemplateOutlet, NgxPaginationModule],
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.scss',
})
export class GenericTableComponent {
  @ContentChild('headers') headers!: TemplateRef<any>;
  @ContentChild('rows') rows!: TemplateRef<any>;
  title = input.required<string>();
  data = input.required<any[]>();
  config: PaginationInstance = {
    id: 'userOrderPagination',
    itemsPerPage: 10,
    currentPage: 1,
  };
}
