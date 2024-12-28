import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastService } from '../../../../../shared/services/toast.service';
import { AdminProductsService } from '../../../admin-products/services/admin-products.service';
import { AdminCategoriesService } from '../../services/admin-categories.service';
import { LoaderComponent } from '../../../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-delete-category-dialog',
  standalone: true,
  imports: [LoaderComponent],
  templateUrl: './delete-category-dialog.component.html',
  styleUrl: './delete-category-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteCategoryDialogComponent {
  private ref = inject(DynamicDialogRef);
  private toast = inject(ToastService);
  private categoryService = inject(AdminCategoriesService);
  categoryToDelete = this.categoryService.activeCategory;
  isLoading = signal(false);

  onDelete() {
    this.isLoading.set(true);
    this.categoryService
      .deleteCategory(this.categoryToDelete()?.id as string)
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
