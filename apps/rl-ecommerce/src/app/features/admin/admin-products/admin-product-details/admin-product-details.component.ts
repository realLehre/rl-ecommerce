import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { AsyncPipe, CurrencyPipe, Location, NgClass } from '@angular/common';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { PricePercentageDecreasePipe } from '../../../../shared/pipes/price-percentage-decrease.pipe';
import { ProductDetailsImagesComponent } from '../../../products/product-details/product-details-images/product-details-images.component';
import { Router } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { AdminProductsService } from '../services/admin-products.service';
import { switchMap } from 'rxjs';
import { IProduct } from '../../../products/model/product.interface';
import { toObservable } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ProductDeleteDialogComponent } from '../product-delete-dialog/product-delete-dialog.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductReviewsComponent } from '../../../products/product-details/product-reviews/product-reviews.component';
import { ReviewService } from '../../../../shared/services/review.service';
import { LargeReviewsComponent } from '../../../products/product-details/large-reviews/large-reviews.component';

@Component({
  selector: 'app-admin-product-details',
  standalone: true,
  imports: [
    AsyncPipe,
    CurrencyPipe,
    LoaderComponent,
    PricePercentageDecreasePipe,
    ProductDetailsImagesComponent,
    SkeletonModule,
    NgClass,
    ProductReviewsComponent,
    LargeReviewsComponent,
  ],
  templateUrl: './admin-product-details.component.html',
  styleUrl: './admin-product-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProductDetailsComponent {
  private productService = inject(AdminProductsService);
  private router = inject(Router);
  private location = inject(Location);
  private sanitizer = inject(DomSanitizer);
  private dialogService = inject(DialogService);
  private reviewService = inject(ReviewService);
  ref: DynamicDialogRef | undefined;
  id = input.required<string>();
  product$ = toObservable(this.id).pipe(
    switchMap((id) => this.productService.getProductById(id!)),
  );
  isDeletingProduct = signal(false);
  isCollapsed = signal(true);
  limit = 200;
  isShowingFullReview = this.reviewService.seeingFullReview;

  sanitizedDescription(desc: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(desc);
  }

  stripedDescription(desc: string) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = desc;
    return tempDiv.textContent || tempDiv.innerText || '';
  }

  onDeleteProduct(product: IProduct) {
    this.productService.productToDelete.set(product);
    this.ref = this.dialogService.open(ProductDeleteDialogComponent, {
      width: '25rem',
      breakpoints: {
        '450px': '90vw',
      },
      focusOnShow: false,
    });

    this.ref.onClose.subscribe((res) => {
      if (res == 'deleted') {
        this.router.navigate(['/', 'admin', 'products']);
      }
    });
  }

  toggleCollapse() {
    this.isCollapsed.set(!this.isCollapsed());
  }

  onEdit(product: IProduct) {
    localStorage.setItem('selectedProduct', JSON.stringify(product));
    this.router.navigate(['/', 'admin', 'add-product'], {
      queryParams: { edit: true },
    });
  }

  onNavigateBack() {
    this.location.back();
  }
}
