import { Component } from '@angular/core';
import { FeaturedProductComponent } from '../product-options/featured-product/featured-product.component';
import { CategoriesComponent } from '../product-options/categories/categories.component';
import { FiltersComponent } from '../product-options/filters/filters.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [FeaturedProductComponent, CategoriesComponent, FiltersComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent {}
