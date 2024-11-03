import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProductRating } from '../../model/product.interface';
import { ReviewService } from '../../../../shared/services/review.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-reviews.component.html',
  styleUrl: './product-reviews.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductReviewsComponent implements OnInit {
  private reviewService = inject(ReviewService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  reviews = input<IProductRating[]>([]);
  showShortReview = input<boolean>(true);
  stars = signal(
    Array.from({ length: 5 }, (_, i) => ({ star: i + 1, active: false })),
  );
  ratingCounts = signal(
    Array.from({ length: 5 }, (_, i) => ({
      star: i + 1,
      totalRating: 0,
    })).reverse(),
  );
  reviewComments = computed(() => {
    const reviews = [...this.reviews()];
    return this.showShortReview() ? reviews.splice(0, 5) : this.reviews();
  });

  averageRating = computed(() => {
    const totalRating = this.reviews().reduce(
      (acc: number, rating: any) => acc + rating.rating,
      0,
    );
    const rating = totalRating / this.reviews().length;
    return parseFloat(rating.toFixed(2)) || 0;
  });

  showingFullReview = this.reviewService.seeingFullReview;

  ngOnInit() {
    this.reviews().map((review) => {
      const entry = this.ratingCounts().find(
        (count) => count.star == review.rating,
      );
      if (entry) {
        entry.totalRating += 1;
      }
    });
  }

  getStarWidth(starIndex: number): string {
    const fullStars = Math.floor(this.averageRating());
    const partialFill = (this.averageRating() % 1) * 100;

    if (starIndex < fullStars) {
      return '100%';
    } else if (starIndex === fullStars) {
      return `${partialFill}%`;
    } else {
      return '0%';
    }
  }

  onSeeFullReviews() {
    this.reviewService.seeingFullReview.set(true);
    this.router.navigate([], {
      queryParams: { reviews: true },
      queryParamsHandling: 'merge',
      relativeTo: this.route,
    });
  }

  onCloseFullReview() {
    this.reviewService.seeingFullReview.set(false);
    this.router.navigate([], {
      queryParams: { reviews: null },
      queryParamsHandling: 'merge',
      relativeTo: this.route,
    });
  }
}
