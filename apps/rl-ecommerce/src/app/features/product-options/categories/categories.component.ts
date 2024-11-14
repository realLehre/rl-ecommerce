import { Component, inject, OnInit } from '@angular/core';
import { ProductOptionsService } from '../services/product-options.service';
import { ICategory } from '../models/product-options.interface';
import { AsyncPipe, NgClass } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { ActivatedRoute, Router } from '@angular/router';
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
  private router = inject(Router);
  private route = inject(ActivatedRoute);
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

      const queryData = { category: cat };
      sessionStorage.setItem('hshs82haa02sshs92s', JSON.stringify(queryData));
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          category: this.productService.createSlug(cat.name),
        },
        queryParamsHandling: 'replace',
        fragment: 'products',
      });
    } else {
      if (this.optionsService.currentCategory() == null) {
        return;
      }
      this.optionsService.currentCategory.set(null);
      this.optionsService.currentSubCategory.set(null);

      sessionStorage.removeItem('hshs82haa02sshs92s');
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { category: null, subCategory: null, page: null },
        queryParamsHandling: 'replace',
        fragment: 'products',
      });
    }
  }
}
