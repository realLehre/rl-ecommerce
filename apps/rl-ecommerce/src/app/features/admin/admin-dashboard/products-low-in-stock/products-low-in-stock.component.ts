import { Component, inject } from '@angular/core';
import { ProductsLowInStockService } from './services/products-low-in-stock.service';

@Component({
  selector: 'app-products-low-in-stock',
  standalone: true,
  imports: [],
  templateUrl: './products-low-in-stock.component.html',
  styleUrl: './products-low-in-stock.component.scss',
})
export class ProductsLowInStockComponent {
  private productLowInStockService = inject(ProductsLowInStockService);

  ngOnInit() {
    this.productLowInStockService.getProductsLowInStock().subscribe();
  }
}
