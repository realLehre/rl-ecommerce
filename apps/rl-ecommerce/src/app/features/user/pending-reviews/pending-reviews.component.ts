import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ReviewService } from '../../../shared/services/review.service';
import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ReviewFormDialogComponent } from '../../../shared/components/review-form-dialog/review-form-dialog.component';
import { IOrderItem } from '../../../shared/models/order.interface';
import { ImagePreloadDirective } from '../../../shared/directives/image-preload.directive';

@Component({
  selector: 'app-pending-reviews',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    NgClass,
    SkeletonModule,
    ImagePreloadDirective,
  ],
  templateUrl: './pending-reviews.component.html',
  styleUrl: './pending-reviews.component.scss',
})
export class PendingReviewsComponent implements OnInit {
  private reviewService = inject(ReviewService);
  private ref = inject(DynamicDialogRef);
  private dialogService = inject(DialogService);
  private cdr = inject(ChangeDetectorRef);
  orders$ = this.reviewService.getPendingReviews();

  ngOnInit() {}

  onOpenReviewDialog(item: IOrderItem, userId: string) {
    this.ref = this.dialogService.open(ReviewFormDialogComponent, {
      width: '25rem',
      data: { ...item, userId, orderItemId: item.id },
      breakpoints: {
        '450px': '90vw',
      },
      focusOnShow: false,
    });

    this.ref.onClose.subscribe((event) => {
      if (event) {
        this.orders$ = this.reviewService.getPendingReviews();
        this.cdr.detectChanges();
      }
    });
  }
}
