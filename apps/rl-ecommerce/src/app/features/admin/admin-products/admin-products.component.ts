import { Component, inject } from '@angular/core';
import { AdminProductsService } from './services/admin-products.service';
import { GenericTableComponent } from '../../../shared/components/generic-table/generic-table.component';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { IOrder } from '../../../shared/models/order.interface';
import { toSignal } from '@angular/core/rxjs-interop';
import { ICategory, IProduct } from '../../products/model/product.interface';
import { MenuModule } from 'primeng/menu';
import { PrimeTemplate } from 'primeng/api';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [
    GenericTableComponent,
    NgClass,
    CurrencyPipe,
    DatePipe,
    MenuModule,
    PrimeTemplate,
  ],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.scss',
})
export class AdminProductsComponent {
  private productService = inject(AdminProductsService);
  products = toSignal(this.productService.products, { initialValue: [] });
  sortUsed: boolean = false;
  sortColumn: keyof IProduct | keyof ICategory | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  onEdit() {}

  onDelete() {}

  sortTable(column: keyof IProduct | keyof ICategory): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortUsed = true;

    this.products().sort((a, b) => {
      // if(column == 'category'){
      //   const valueA = a[column];
      //   const valueB = b[column];
      // } else {
      //
      // const valueA = a[column];
      // const valueB = b[column];
      // }

      const valueA = a[column];
      const valueB = b[column];

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;

      return 0;
    });
  }
}
