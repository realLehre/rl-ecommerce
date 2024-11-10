import { Component, inject, OnInit } from '@angular/core';
import { ReviewService } from '../../../shared/services/review.service';
import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-pending-reviews',
  standalone: true,
  imports: [AsyncPipe, DatePipe, NgClass, SkeletonModule],
  templateUrl: './pending-reviews.component.html',
  styleUrl: './pending-reviews.component.scss',
})
export class PendingReviewsComponent implements OnInit {
  private reviewService = inject(ReviewService);
  orders$ = this.reviewService.getPendingReviews();
  ngOnInit() {
    this.reviewService.getPendingReviews().subscribe((res) => {
      console.log(res);
    });
  }
}
