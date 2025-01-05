import { Component, inject, OnInit, signal } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ReviewService } from '../../services/review.service';
import { ToastService } from '../../services/toast.service';
import { NgClass } from '@angular/common';
import { LoaderComponent } from '../loader/loader.component';
import { ImagePreloadDirective } from '../../directives/image-preload.directive';

@Component({
  selector: 'app-review-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    LoaderComponent,
    ImagePreloadDirective,
  ],
  templateUrl: './review-form-dialog.component.html',
  styleUrl: './review-form-dialog.component.scss',
})
export class ReviewFormDialogComponent implements OnInit {
  private reviewService = inject(ReviewService);
  private toast = inject(ToastService);
  selectedOrderItem = inject(DynamicDialogConfig<any>);
  private ref = inject(DynamicDialogRef);
  reviewForm!: FormGroup;
  isReadOnly = signal(false);
  stars = signal<{ star: number; active: boolean }[]>(
    Array.from({ length: 5 }, (_, i) => ({ star: i + 1, active: false })),
  );
  selectedRating = 0;
  isSubmitting = signal(false);

  ngOnInit() {
    this.reviewForm = new FormGroup<any>({
      title: new FormControl(
        { value: null, disabled: this.isReadOnly() },
        Validators.required,
      ),
      comment: new FormControl({ value: null, disabled: this.isReadOnly() }),
    });

    if (this.selectedOrderItem.data.viewingReview) {
      this.onSetStar(this.selectedOrderItem.data.orderItem.rating.rating - 1);
      this.isReadOnly.set(true);
      this.reviewForm.disable();
      this.reviewForm.setValue({
        title: this.selectedOrderItem.data.orderItem.rating.title,
        comment: this.selectedOrderItem.data.orderItem.rating?.comment || '',
      });
    }
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
      productId: this.selectedOrderItem.data.productId,
      orderItemId: this.selectedOrderItem.data.orderItemId,
      userId: this.selectedOrderItem.data.userId,
    };

    this.reviewService.createReview(reviewData).subscribe({
      next: () => {
        this.toast.showToast({
          type: 'success',
          message: 'Review submitted successfully!',
        });
        this.ref.close('submitted');
        this.isSubmitting.set(false);
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
    this.ref.close();
  }

  isInvalidAndTouched(control: any) {
    return (
      this.reviewForm.get(control)?.touched &&
      this.reviewForm.get(control)?.invalid
    );
  }
}
