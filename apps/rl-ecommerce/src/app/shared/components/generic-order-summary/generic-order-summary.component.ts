import { Component, inject, input, output } from '@angular/core';
import { ICartItems } from '../../models/cart.interface';
import { CurrencyPipe, NgClass } from '@angular/common';
import {
  GrandTotalPipe,
  SubtotalPipe,
  TotalDeliveryPipe,
} from '../../pipes/subtotal.pipe';
import { SkeletonModule } from 'primeng/skeleton';
import { Router } from '@angular/router';
import { ProductsService } from '../../../features/products/services/products.service';
import { DialogModule } from 'primeng/dialog';
import { LoaderComponent } from '../loader/loader.component';
import { PrimeTemplate } from 'primeng/api';
import { IOrder, IOrderItem } from '../../models/order.interface';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ReviewFormDialogComponent } from '../review-form-dialog/review-form-dialog.component';

@Component({
  selector: 'app-generic-order-summary',
  standalone: true,
  imports: [
    CurrencyPipe,
    SubtotalPipe,
    TotalDeliveryPipe,
    GrandTotalPipe,
    SkeletonModule,
    DialogModule,
    LoaderComponent,
    PrimeTemplate,
    NgClass,
  ],
  templateUrl: './generic-order-summary.component.html',
  styleUrl: './generic-order-summary.component.scss',
})
export class GenericOrderSummaryComponent {
  router = inject(Router);
  private productService = inject(ProductsService);
  private ref = inject(DynamicDialogRef);
  private dialogService = inject(DialogService);
  paymentMethod = input<string>();
  order = input<IOrder>();
  deliveryStatus = input<string>();
  reviewGiven = output<void>();

  onViewDetails(product: any) {
    this.productService.activeProduct.set(product);
    this.router.navigate(
      ['/product/' + this.productService.createSlug(product.name)],
      {
        queryParams: { id: product.id },
      },
    );
  }

  onReviewProduct(item: ICartItems, orderItem: IOrderItem) {
    this.ref = this.dialogService.open(ReviewFormDialogComponent, {
      width: '25rem',
      data: {
        ...item,
        userId: this.order()?.userId,
        orderItemId: orderItem.id,
      },
      breakpoints: {
        '450px': '90vw',
      },
      focusOnShow: false,
    });

    this.ref.onClose.subscribe((event) => {
      if (event) {
        this.reviewGiven.emit();
      }
    });
  }

  onSeeReview(item: ICartItems, orderItem: IOrderItem) {
    this.dialogService.open(ReviewFormDialogComponent, {
      width: '25rem',
      data: {
        ...item,
        orderItem,
        viewingReview: true,
      },
      breakpoints: {
        '450px': '90vw',
      },
      focusOnShow: false,
    });
  }
}
