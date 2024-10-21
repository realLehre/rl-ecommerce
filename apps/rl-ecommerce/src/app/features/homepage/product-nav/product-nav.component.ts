import { Component, inject, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { ProductOptionsService } from '../../product-options/services/product-options.service';
import { ISubCategory } from '../../products/model/product.interface';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-nav',
  standalone: true,
  imports: [NgClass],
  templateUrl: './product-nav.component.html',
  styleUrl: './product-nav.component.scss',
})
export class ProductNavComponent implements OnInit {
  private optionsService = inject(ProductOptionsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  currentCategory = this.optionsService.currentCategory;

  currentSubCategory = this.optionsService.currentSubCategory;

  ngOnInit() {}

  onViewSubCategory(cat?: ISubCategory) {
    if (!cat) {
      this.currentSubCategory.set(null);
      const queryData = { category: this.currentCategory() };
      sessionStorage.setItem('hshs82haa02sshs92s', JSON.stringify(queryData));
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { subCategory: null },
        queryParamsHandling: 'merge',
      });
    } else {
      this.currentSubCategory.set(cat);
      const queryData = { category: this.currentCategory(), subCategory: cat };
      sessionStorage.setItem('hshs82haa02sshs92s', JSON.stringify(queryData));
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { subCategory: this.optionsService.createSlug(cat.name) },
        queryParamsHandling: 'merge',
      });
    }
  }
}
