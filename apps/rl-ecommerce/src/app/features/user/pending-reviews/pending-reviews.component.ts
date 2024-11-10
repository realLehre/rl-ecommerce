import { Component, inject, OnInit } from '@angular/core';
import { ReviewService } from '../../../shared/services/review.service';

@Component({
  selector: 'app-pending-reviews',
  standalone: true,
  imports: [],
  templateUrl: './pending-reviews.component.html',
  styleUrl: './pending-reviews.component.scss',
})
export class PendingReviewsComponent implements OnInit {
  private reviewService = inject(ReviewService);
  ngOnInit() {
    this.reviewService.getPendingReviews().subscribe();
  }
}
