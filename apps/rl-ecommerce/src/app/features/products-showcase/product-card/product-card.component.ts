import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { IProduct } from '../../products/model/product.interface';
import { ProductsService } from '../../products/services/products.service';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe, SkeletonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  router = inject(Router);
  private productService = inject(ProductsService);
  product = input.required<IProduct>();

  onViewDetails(product: IProduct) {
    this.productService.activeProduct.set(product);
    this.router.navigate(['/product/' + product.name], {
      queryParams: { id: product.id },
    });
  }
}
