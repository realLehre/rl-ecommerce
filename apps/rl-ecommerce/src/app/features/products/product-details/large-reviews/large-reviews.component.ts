import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductReviewsComponent } from '../product-reviews/product-reviews.component';
import { IProductRating } from '../../model/product.interface';

@Component({
  selector: 'app-large-reviews',
  standalone: true,
  imports: [CommonModule, ProductReviewsComponent],
  templateUrl: './large-reviews.component.html',
  styleUrl: './large-reviews.component.css',
})
export class LargeReviewsComponent {
  reviews = input<IProductRating[]>([]);
}
