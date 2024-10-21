import { Component, inject, OnInit } from '@angular/core';
import { ProductOptionsService } from '../services/product-options.service';
import { Observable } from 'rxjs';
import {
  ICategory,
  ISavedProductOptionQueries,
} from '../models/product-options.interface';
import { AsyncPipe, NgClass } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../products/services/products.service';

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
  categories$ = this.optionsService.getCategories();
  activeCategory = this.optionsService.currentCategory;

  ngOnInit() {}

  onSetCategory(cat?: ICategory) {
    this.productService.productSignal.set(null);
    this.optionsService.currentPage.set(1);
    if (cat) {
      this.optionsService.currentCategory.set(cat);
      this.optionsService.currentSubCategory.set(null);

      // const savedQuery: ISavedProductOptionQueries = JSON.parse(
      //   sessionStorage.getItem('hshs82haa02sshs92s')!,
      // );

      const queryData = { category: cat };
      sessionStorage.setItem('hshs82haa02sshs92s', JSON.stringify(queryData));
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          category: this.createSlug(cat.name),
        },
        queryParamsHandling: 'replace',
        fragment: 't',
      });
    } else {
      this.optionsService.currentCategory.set(null);
      this.optionsService.currentSubCategory.set(null);

      sessionStorage.removeItem('hshs82haa02sshs92s');
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { category: null, subCategory: null, page: null },
        queryParamsHandling: 'replace',
        fragment: 't',
      });
    }
  }

  createSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace spaces and special characters with hyphen
      .replace(/^-+|-+$/g, ''); // Trim leading or trailing hyphens
  }
}
