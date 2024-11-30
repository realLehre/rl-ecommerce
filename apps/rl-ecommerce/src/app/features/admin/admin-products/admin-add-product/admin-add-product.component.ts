import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AdminProductFormComponent } from './admin-product-form/admin-product-form.component';

@Component({
  selector: 'app-admin-add-product',
  standalone: true,
  imports: [AdminProductFormComponent],
  templateUrl: './admin-add-product.component.html',
  styleUrl: './admin-add-product.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminAddProductComponent {}
