import { Component } from '@angular/core';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { ProductDetailsImagesComponent } from './product-details-images/product-details-images.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { RecommendedProductsComponent } from '../recommended-products/recommended-products.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    ProductDetailsImagesComponent,
    LoaderComponent,
    RecommendedProductsComponent,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent {
  quantity: number = 10;
  isLoading: boolean = false;
  onAdjustQuantity(action: string) {
    if (this.quantity == 0) {
      return;
    }

    this.setLoader();

    if (action.toLowerCase() == 'increase') {
      this.quantity++;
    } else {
      this.quantity--;
    }
  }

  setLoader() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }
}
