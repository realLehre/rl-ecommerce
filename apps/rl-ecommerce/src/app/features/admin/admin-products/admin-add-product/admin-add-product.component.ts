import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { AdminProductFormComponent } from './admin-product-form/admin-product-form.component';
import { AdminProductImagesComponent } from './admin-product-images/admin-product-images.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Location, NgClass } from '@angular/common';
import { CanComponentDeactivate } from '../../../../shared/guards/has-unsaved-changes.guard';
import { AdminProductsService } from '../services/admin-products.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { IProduct } from '../../../products/model/product.interface';

@Component({
  selector: 'app-admin-add-product',
  standalone: true,
  imports: [
    AdminProductFormComponent,
    AdminProductImagesComponent,
    NgClass,
    LoaderComponent,
  ],
  templateUrl: './admin-add-product.component.html',
  styleUrl: './admin-add-product.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminAddProductComponent
  implements CanComponentDeactivate, OnInit, OnDestroy
{
  private productService = inject(AdminProductsService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  productForm!: FormGroup;
  coverImage: string = '';
  imageUrls: string[] = [];
  productData!: IProduct;
  isEditing = signal(false);
  isSubmitting = signal(false);
  ignoreCanDeactivate = signal(false);
  editCanceled = signal(false);

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['edit']) {
        const productData: IProduct = this.productService.activeProduct()!;
        if (productData) {
          this.isEditing.set(true);
          this.productData = productData;
          this.coverImage = productData.image;
          const images = [...productData.imageUrls];
          this.imageUrls = images?.slice(1);
        } else {
          this.router.navigate([], {
            queryParams: null,
            queryParamsHandling: 'replace',
            relativeTo: this.route,
          });
        }
      }
    });
  }

  isProductCreateDataInvalid() {
    return (
      this.productForm?.invalid ||
      this.coverImage == '' ||
      (this.productForm.value.price >= this.productForm.value.previousPrice &&
        this.productForm.value.previousPrice != 0 &&
        this.productForm.value.previousPrice != null)
    );
  }

  onGetFormValue(event: any) {
    this.productForm = event;
  }

  onGetImageUrls(event: { imageUrls: string[]; coverImageUrl: string }) {
    this.coverImage = event.coverImageUrl;
    this.imageUrls = event.imageUrls;
  }

  onSubmit() {
    if (this.isProductCreateDataInvalid()) {
      return;
    }
    this.imageUrls = this.imageUrls.filter((url) => url != '');

    this.isSubmitting.set(true);
    if (!this.isEditing()) {
      this.productService
        .addProduct({
          ...this.productForm.value,
          isSoldOut: !this.productForm.value.unit,
          previousPrice: this.productForm.value.previousPrice ?? 0,
          image: this.coverImage,
          imageUrls: [this.coverImage, ...this.imageUrls],
          videoUrls: [],
        })
        .subscribe({
          next: () => {
            this.toastService.showToast({
              message: 'Product added successfully!',
              type: 'success',
            });
            this.ignoreCanDeactivate.set(true);
            this.router.navigate(['/', 'admin', 'products']);
            this.isSubmitting.set(false);
          },
          error: (error) => {
            this.isSubmitting.set(false);
            this.toastService.showToast({
              type: 'error',
              message: error.error.message,
            });
          },
        });
    } else
      this.productService
        .updateProduct(
          {
            ...this.productForm.value,
            isSoldOut: !this.productForm.value.unit,
            image: this.coverImage,
            imageUrls: [this.coverImage, ...this.imageUrls],
            videoUrls: [],
          },
          this.productData.id,
        )
        .subscribe({
          next: (res) => {
            this.toastService.showToast({
              message: 'Product updated successfully!',
              type: 'success',
            });
            this.ignoreCanDeactivate.set(true);
            this.isEditing.set(false);
            localStorage.removeItem('selectedProduct');
            this.router.navigate(['/', 'admin', 'products', res.id]);
            this.isSubmitting.set(false);
          },
          error: (error) => {
            this.isSubmitting.set(false);
            this.toastService.showToast({
              type: 'error',
              message: error.error.message,
            });
          },
        });
  }

  onCancelEdit() {
    this.editCanceled.set(true);
    this.ignoreCanDeactivate.set(false);
    this.isEditing.set(false);
    localStorage.removeItem('selectedProduct');
    this.location.back();
  }

  canDeactivate(): boolean {
    if (this.ignoreCanDeactivate()) {
      return true;
    }
    if (
      this.productService.getFormControlStatus(this.productForm) ||
      this.coverImage !== '' ||
      this.imageUrls.length !== 0 ||
      !this.editCanceled()
    ) {
      return confirm(
        'You have unsaved changes, are you sure you want to quit?',
      );
    } else {
      return true;
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadNotification($event: any) {
    if (!this.ignoreCanDeactivate() && !this.canDeactivate()) {
      $event.returnValue = true;
    }
  }

  ngOnDestroy() {}
}
