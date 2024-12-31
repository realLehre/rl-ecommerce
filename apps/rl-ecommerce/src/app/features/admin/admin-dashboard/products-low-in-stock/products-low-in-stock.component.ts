import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  Signal,
  ViewChild,
} from '@angular/core';
import { ProductsLowInStockService } from './services/products-low-in-stock.service';
import { GenericTableComponent } from '../../../../shared/components/generic-table/generic-table.component';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  IProduct,
  IProductResponse,
} from '../../../products/model/product.interface';
import { PaginationInstance } from 'ngx-pagination';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Menu, MenuModule } from 'primeng/menu';
import { PrimeTemplate } from 'primeng/api';
import { ProductDeleteDialogComponent } from '../../admin-products/product-delete-dialog/product-delete-dialog.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';
import { AdminProductsService } from '../../admin-products/services/admin-products.service';
import { switchMap, tap } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-products-low-in-stock',
  standalone: true,
  imports: [
    GenericTableComponent,
    CurrencyPipe,
    DatePipe,
    MenuModule,
    PrimeTemplate,
    SkeletonModule,
  ],
  templateUrl: './products-low-in-stock.component.html',
  styleUrl: './products-low-in-stock.component.scss',
})
export class ProductsLowInStockComponent {
  private productLowInStockService = inject(ProductsLowInStockService);
  private productService = inject(AdminProductsService);
  private router = inject(Router);
  private dialogService = inject(DialogService);
  private ref: DynamicDialogRef | undefined;
  @ViewChild('filterMenu') menu!: Menu;
  @ViewChild('menu') productActionMenu!: Menu;
  selectedProduct!: IProduct;
  page = signal(1);
  isLoading = signal(true);
  products$ = toObservable(this.page).pipe(
    switchMap((page) =>
      this.productLowInStockService.getProductsLowInStock(page),
    ),
    tap(() => {
      this.isLoading.set(false);
    }),
  );
  productData: Signal<Partial<IProductResponse> | undefined> = toSignal(
    this.products$,
  );

  onViewDetails() {
    this.router.navigate(['/', 'admin', 'products', this.selectedProduct.id]);
  }

  pageChange(page: number) {
    this.isLoading.set(true);
    this.page.set(page);
  }

  onEdit() {
    this.productService.activeProduct.set(this.selectedProduct);
    this.router.navigate(['/', 'admin', 'add-product'], {
      queryParams: { edit: true },
    });
  }

  onDelete() {
    this.productService.productToDelete.set(this.selectedProduct);
    this.ref = this.dialogService.open(ProductDeleteDialogComponent, {
      width: '25rem',
      breakpoints: {
        '450px': '90vw',
      },
      focusOnShow: false,
    });

    this.ref.onClose.subscribe((res) => {
      if (res == 'deleted') {
        this.page.set(1);
      }
    });
  }

  onOpenProductActionMenu(event: Event, product: IProduct) {
    this.productActionMenu.show(event);
    this.selectedProduct = product;
    this.productService.activeProduct.set(product);
  }
}
