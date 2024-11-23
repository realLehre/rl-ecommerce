import { Component, inject, signal } from '@angular/core';
import { AsyncPipe, CurrencyPipe, NgClass } from '@angular/common';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { LargeReviewsComponent } from '../../../products/product-details/large-reviews/large-reviews.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { PricePercentageDecreasePipe } from '../../../../shared/pipes/price-percentage-decrease.pipe';
import { ProductDetailsImagesComponent } from '../../../products/product-details/product-details-images/product-details-images.component';
import { ProductQuantityComponent } from '../../../../shared/components/product-quantity/product-quantity.component';
import { ProductReviewsComponent } from '../../../products/product-details/product-reviews/product-reviews.component';
import { RecommendedProductsComponent } from '../../../products/recommended-products/recommended-products.component';
import { RouterLink } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { AdminProductsService } from '../services/admin-products.service';
import { of } from 'rxjs';
import { IProduct } from '../../../products/model/product.interface';

@Component({
  selector: 'app-admin-product-details',
  standalone: true,
  imports: [
    AsyncPipe,
    BreadcrumbComponent,
    CurrencyPipe,
    LargeReviewsComponent,
    LoaderComponent,
    PricePercentageDecreasePipe,
    ProductDetailsImagesComponent,
    ProductQuantityComponent,
    ProductReviewsComponent,
    RecommendedProductsComponent,
    RouterLink,
    SkeletonModule,
    NgClass,
  ],
  templateUrl: './admin-product-details.component.html',
  styleUrl: './admin-product-details.component.scss',
})
export class AdminProductDetailsComponent {
  productService = inject(AdminProductsService);
  product$ = of(this.productService.activeProduct());
  isDeletingProduct = signal(false);
  isCollapsed = signal(true);
  limit = 200;

  onDeleteProduct(product: IProduct) {}

  toggleCollapse() {
    this.isCollapsed.set(!this.isCollapsed());
  }
}
