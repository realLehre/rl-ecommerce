import { Component, inject, OnInit } from '@angular/core';
import { ProductOptionsService } from '../services/product-options.service';
import { ICategory } from '../models/product-options.interface';
import { AsyncPipe, NgClass } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { ProductsService } from '../../products/services/products.service';
import { LayoutService } from '../../../shared/services/layout.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [AsyncPipe, SkeletonModule, NgClass],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit {
  private optionsService = inject(ProductOptionsService);
  private productService = inject(ProductsService);
  private layoutService = inject(LayoutService);
  categories$ = this.optionsService.getCategories();
  activeCategory = this.optionsService.currentCategory;

  ngOnInit() {}

  onSetCategory(cat?: ICategory) {
    this.layoutService.menuOpened.set(false);
    if (this.activeCategory()?.id == cat?.id) {
      return;
    }

    this.productService.productSignal.set(null);
    this.optionsService.currentPage.set(1);
    this.optionsService.currentPriceFilter.set(null);
    if (cat) {
      this.optionsService.currentCategory.set(cat);
      this.optionsService.currentSubCategory.set(null);
    } else {
      if (this.optionsService.currentCategory() == null) {
        return;
      }
      this.optionsService.currentCategory.set(null);
      this.optionsService.currentSubCategory.set(null);
    }
    this.optionsService.setDataAndRoute();
  }
}
