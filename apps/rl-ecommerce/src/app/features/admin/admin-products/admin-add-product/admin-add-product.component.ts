import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AdminProductFormComponent } from './admin-product-form/admin-product-form.component';
import { AdminProductImagesComponent } from './admin-product-images/admin-product-images.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-add-product',
  standalone: true,
  imports: [AdminProductFormComponent, AdminProductImagesComponent, RouterLink],
  templateUrl: './admin-add-product.component.html',
  styleUrl: './admin-add-product.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminAddProductComponent {}
