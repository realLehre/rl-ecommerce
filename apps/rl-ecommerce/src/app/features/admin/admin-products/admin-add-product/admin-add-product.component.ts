import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
} from '@angular/core';
import { AdminProductFormComponent } from './admin-product-form/admin-product-form.component';
import { AdminProductImagesComponent } from './admin-product-images/admin-product-images.component';
import { RouterLink } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { NgClass } from '@angular/common';
import { CanComponentDeactivate } from '../../../../shared/guards/has-unsaved-changes.guard';
import { AdminProductsService } from '../services/admin-products.service';

@Component({
  selector: 'app-admin-add-product',
  standalone: true,
  imports: [
    AdminProductFormComponent,
    AdminProductImagesComponent,
    RouterLink,
    NgClass,
  ],
  templateUrl: './admin-add-product.component.html',
  styleUrl: './admin-add-product.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminAddProductComponent implements CanComponentDeactivate {
  productService = inject(AdminProductsService);
  productForm!: FormGroup;
  coverImage: string = '';
  imageUrls: string[] = [];

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
}
