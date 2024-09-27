import { Component } from '@angular/core';
import { FeaturedProductComponent } from '../product-options/featured-product/featured-product.component';
import { CategoriesComponent } from '../product-options/categories/categories.component';
import { FiltersComponent } from '../product-options/filters/filters.component';
import { ProductNavComponent } from './product-nav/product-nav.component';
import { ProductsShowcaseComponent } from '../products-showcase/products-showcase.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    FeaturedProductComponent,
    CategoriesComponent,
    FiltersComponent,
    ProductNavComponent,
    ProductsShowcaseComponent,
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent {}
