import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { AdminProductFormComponent } from './admin-product-form/admin-product-form.component';
import { AdminProductImagesComponent } from './admin-product-images/admin-product-images.component';
import { RouterLink } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { NgClass } from '@angular/common';
import { flatten } from '@nestjs/common';

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
export class AdminAddProductComponent {
  productForm!: FormGroup;
  coverImage: string = '';
  imageUrls: string[] = [];

  isProductCreateDataInvalid() {
    return this.productForm?.invalid || this.coverImage == '';
  }

  onGetFormValue(event: any) {
    this.productForm = event;
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
}
