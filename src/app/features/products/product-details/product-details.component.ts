import { Component } from '@angular/core';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { ProductDetailsImagesComponent } from './product-details-images/product-details-images.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [BreadcrumbComponent, ProductDetailsImagesComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent {}
