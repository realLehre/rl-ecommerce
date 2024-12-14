import { Component, inject, signal } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastService } from '../../../../shared/services/toast.service';
import { AdminProductsService } from '../services/admin-products.service';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-product-delete-dialog',
  standalone: true,
  imports: [LoaderComponent],
  templateUrl: './product-delete-dialog.component.html',
  styleUrl: './product-delete-dialog.component.scss',
})
export class ProductDeleteDialogComponent {
  private ref = inject(DynamicDialogRef);
  private toast = inject(ToastService);
  private productService = inject(AdminProductsService);
  productToDelete = this.productService.productToDelete;
  isLoading = signal(false);

  onDelete() {
    this.isLoading.set(true);
    this.productService
      .deleteProduct(this.productToDelete()?.id as string)
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.toast.showToast({
            type: 'success',
            message: 'Product deleted successfully',
          });
          this.ref.close('deleted');
        },
        error: (err) => {
          this.isLoading.set(false);
          this.toast.showToast({
            type: 'error',
            message: err.error.message,
          });
        },
      });
  }
  onCloseDialog() {
    this.ref.close('close');
  }
}
