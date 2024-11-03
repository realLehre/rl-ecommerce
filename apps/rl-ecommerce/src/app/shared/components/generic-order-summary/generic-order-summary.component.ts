import {
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
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
import { IProduct } from '../../../features/products/model/product.interface';
import { DialogModule } from 'primeng/dialog';
import { LoaderComponent } from '../loader/loader.component';
import { PrimeTemplate } from 'primeng/api';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IOrder, IOrderItem } from '../../models/order.interface';
import { ReviewService } from '../../services/review.service';
import { ToastService } from '../../services/toast.service';

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
    ReactiveFormsModule,
  ],
  templateUrl: './generic-order-summary.component.html',
  styleUrl: './generic-order-summary.component.scss',
})
export class GenericOrderSummaryComponent implements OnInit {
  router = inject(Router);
  private productService = inject(ProductsService);
  private reviewService = inject(ReviewService);
  private toast = inject(ToastService);
  paymentMethod = input<string>();
  order = input<IOrder>();
  deliveryStatus = input<string>();
  showReviewDialog = signal(false);
  isSubmitting = signal(false);
  selectedProduct!: ICartItems;
  selectedOrderItem!: IOrderItem;
  stars = signal<{ star: number; active: boolean }[]>(
    Array.from({ length: 5 }, (_, i) => ({ star: i + 1, active: false })),
  );
  selectedRating = 0;
  reviewForm!: FormGroup;
  reviewGiven = output<void>();
  isReadOnly = signal(false);

  ngOnInit() {
    this.reviewForm = new FormGroup<any>({
      title: new FormControl(
        { value: null, disabled: this.isReadOnly() },
        Validators.required,
      ),
      comment: new FormControl({ value: null, disabled: this.isReadOnly() }),
    });
  }

  isInvalidAndTouched(control: any) {
    return (
      this.reviewForm.get(control)?.touched &&
      this.reviewForm.get(control)?.invalid
    );
  }

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
    this.selectedProduct = item;
    this.selectedOrderItem = orderItem;
    this.showReviewDialog.set(true);
  }

  onSetStar(index: number) {
    if (this.isReadOnly()) {
      return;
    }
    const idx = index + 1;
    this.selectedRating = index + 1;
    let newStars = Array.from({ length: 5 }, (_, i) => ({
      star: i + 1,
      active: false,
    }));

    newStars = newStars.map((item, i) => {
      if (i < idx) {
        item.active = true;
      }
      return item;
    });

    this.stars.set([...newStars]);
  }

  onSubmitReview() {
    if (this.reviewForm.invalid && this.selectedRating == 0) {
      this.reviewForm.markAllAsTouched();
      return;
    }
    this.isSubmitting.set(true);
    const reviewData = {
      rating: this.selectedRating,
      title: this.reviewForm.value.title,
      comment: this.reviewForm.value.comment,
      productId: this.selectedProduct.productId,
      orderItemId: this.selectedOrderItem.id,
      userId: this.order()?.userId,
    };

    this.reviewService.createReview(reviewData).subscribe({
      next: (res) => {
        this.reviewGiven.emit();
        this.toast.showToast({
          type: 'success',
          message: 'Review submitted successfully!',
        });
        this.isSubmitting.set(false);
        this.showReviewDialog.set(false);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.toast.showToast({
          type: 'error',
          message: err.error.message,
        });
      },
    });
  }

  onCloseDialog() {
    this.showReviewDialog.set(false);
    this.isReadOnly.set(false);
    this.reviewForm.enable();
  }

  onSeeReview(item: ICartItems, orderItem: IOrderItem) {
    this.onSetStar(orderItem.rating.rating - 1);
    this.isReadOnly.set(true);
    this.reviewForm.disable();
    this.selectedProduct = item;
    this.selectedOrderItem = orderItem;
    this.showReviewDialog.set(true);

    this.reviewForm.setValue({
      title: orderItem.rating.title,
      comment: orderItem.rating?.comment || '',
    });
  }
}
