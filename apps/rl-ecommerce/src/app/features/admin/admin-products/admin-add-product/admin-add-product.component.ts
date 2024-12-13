import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { AdminProductFormComponent } from './admin-product-form/admin-product-form.component';
import { AdminProductImagesComponent } from './admin-product-images/admin-product-images.component';
import { RouterLink } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { NgClass } from '@angular/common';
import { CanComponentDeactivate } from '../../../../shared/guards/has-unsaved-changes.guard';
import { AdminProductsService } from '../services/admin-products.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-admin-add-product',
  standalone: true,
  imports: [
    AdminProductFormComponent,
    AdminProductImagesComponent,
    RouterLink,
    NgClass,
    LoaderComponent,
  ],
  templateUrl: './admin-add-product.component.html',
  styleUrl: './admin-add-product.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminAddProductComponent
  implements CanComponentDeactivate, OnDestroy
{
  private productService = inject(AdminProductsService);
  private toastService = inject(ToastService);
  productForm!: FormGroup;
  coverImage: string = '';
  imageUrls: string[] = [];
  isSubmitting = signal(false);

  isProductCreateDataInvalid() {
    return this.productForm?.invalid || this.coverImage == '';
  }

  onGetFormValue(event: any) {
    this.productForm = event;
    console.log(event);
  }

  onGetImageUrls(event: { imageUrls: string[]; coverImageUrl: string }) {
    console.log(event);
    this.coverImage = event.coverImageUrl;
    this.imageUrls = event.imageUrls;
  }

  onSubmit() {
    if (this.isProductCreateDataInvalid()) {
      return;
    }
    this.isSubmitting.set(true);
    this.productService
      .addProduct({
        ...this.productForm.value,
        image: this.coverImage,
        imageUrls: this.imageUrls,
        videoUrls: [],
      })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.toastService.showToast({
            message: 'Product added successfully!',
            type: 'success',
          });
        },
        error: (error) => {
          this.isSubmitting.set(false);
          this.toastService.showToast({
            type: 'error',
            message: error.error.message,
          });
        },
      });
    console.log({
      ...this.productForm.value,
      image: this.coverImage,
      imageUrls: this.imageUrls,
      videoUrls: [],
    });
  }

  canDeactivate(): boolean {
    if (
      this.productService.getFormControlStatus(this.productForm) ||
      this.coverImage !== '' ||
      this.imageUrls.length !== 0
    ) {
      return confirm(
        'You have unsaved changes, are you sure you want to quit?',
      );
    } else {
      return true;
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (!this.canDeactivate()) {
      $event.returnValue = true;
    }
  }

  ngOnDestroy() {
    this.canDeactivate();
  }
}
