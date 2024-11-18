import { Component, inject } from '@angular/core';
import { AdminProductsService } from './services/admin-products.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.scss',
})
export class AdminProductsComponent {
  private productService = inject(AdminProductsService);
  products = this.productService.products;
}
