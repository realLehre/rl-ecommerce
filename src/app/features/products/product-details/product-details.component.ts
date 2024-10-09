import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { ProductDetailsImagesComponent } from './product-details-images/product-details-images.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { RecommendedProductsComponent } from '../recommended-products/recommended-products.component';
import { ProductQuantityComponent } from '../../../shared/components/product-quantity/product-quantity.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    ProductDetailsImagesComponent,
    LoaderComponent,
    RecommendedProductsComponent,
    ProductQuantityComponent,
    RouterLink,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsComponent {
  quantity: number = 1;
  isLoading: boolean = false;
  onAdjustQuantity(qty: number) {
    this.quantity = qty;
  }
}
