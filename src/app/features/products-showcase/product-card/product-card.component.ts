import { Component, input } from '@angular/core';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  product = input.required<{
    image: string;
    name: string;
    price: number;
    rating: number;
    id: string;
  }>();
}
