import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProductRating } from '../../model/product.interface';

@Component({
  selector: 'app-product-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-reviews.component.html',
  styleUrl: './product-reviews.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductReviewsComponent implements OnInit {
  reviews = input<IProductRating[]>([]);
  stars = signal(
    Array.from({ length: 5 }, (_, i) => ({ star: i + 1, active: false })),
  );
  ratingCounts = signal(
    Array.from({ length: 5 }, (_, i) => ({
      star: i + 1,
      totalRating: 0,
    })).reverse(),
  );

  averageRating = computed(() => {
    const totalRating = this.reviews().reduce(
      (acc: number, rating: any) => acc + rating.rating,
      0,
    );
    const rating = totalRating / this.reviews().length;
    return parseFloat(rating.toFixed(2)) || 0;
  });

  ngOnInit() {
    this.reviews().map((review) => {
      const entry = this.ratingCounts().find(
        (count) => count.star == review.rating,
      );
      if (entry) {
        entry.totalRating += 1;
      }
    });
    console.log(this.ratingCounts());
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
}
