import { Component, inject, input, OnInit, signal } from '@angular/core';
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
  paymentMethod = input<string>();
  cartItems = input<ICartItems[]>([]);
  showReviewDialog = signal(true);
  isSubmitting = signal(false);
  selectedProduct!: ICartItems;
  stars = signal<{ star: number; active: boolean }[]>(
    Array.from({ length: 5 }, (_, i) => ({ star: i + 1, active: false })),
  );
  reviewForm!: FormGroup;

  ngOnInit() {
    this.reviewForm = new FormGroup<any>({
      title: new FormControl(null, Validators.required),
      comment: new FormControl(null),
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

  onReviewProduct(item: ICartItems) {
    this.selectedProduct = item;
    this.showReviewDialog.set(true);
  }

  onSetStar(index: number) {
    const idx = index + 1;
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

  onSubmitReview() {}

  onCloseDialog() {
    this.showReviewDialog.set(false);
  }
}
