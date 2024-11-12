import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { ProductOptionsService } from '../../product-options/services/product-options.service';
import { ISubCategory } from '../../products/model/product.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../products/services/products.service';

@Component({
  selector: 'app-product-nav',
  standalone: true,
  imports: [NgClass],
  templateUrl: './product-nav.component.html',
  styleUrl: './product-nav.component.scss',
})
export class ProductNavComponent implements OnInit, AfterViewInit {
  private optionsService = inject(ProductOptionsService);
  private router = inject(Router);
  private productService = inject(ProductsService);
  private route = inject(ActivatedRoute);
  currentCategory = this.optionsService.currentCategory;
  currentSubCategory = this.optionsService.currentSubCategory;
  @ViewChildren('subCategoryNav') subCategoryLinks!: QueryList<ElementRef>;

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.scrollToTab();
    }, 50);
  }

  onViewSubCategory(cat?: ISubCategory) {
    this.productService.productSignal.set(null);
    this.optionsService.currentPage.set(1);

    if (!cat) {
      this.currentSubCategory.set(null);
      const queryData = { category: this.currentCategory() };
      sessionStorage.setItem('hshs82haa02sshs92s', JSON.stringify(queryData));
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { subCategory: null },
        queryParamsHandling: 'merge',
        fragment: 'products',
      });
    } else {
      this.currentSubCategory.set(cat);
      setTimeout(() => {
        this.scrollToTab();
      }, 50);
      const queryData = { category: this.currentCategory(), subCategory: cat };
      sessionStorage.setItem('hshs82haa02sshs92s', JSON.stringify(queryData));
      setTimeout(() => {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {
            subCategory: this.optionsService.createSlug(cat.name),
            page: null,
          },
          queryParamsHandling: 'merge',
          fragment: 'products',
        });
      }, 80);
    }
  }

  scrollToTab() {
    if (this.subCategoryLinks) {
      const activeLink = this.subCategoryLinks.find(
        (link) =>
          link.nativeElement.getAttribute('id') ===
          this.currentSubCategory()?.id,
      );

      if (activeLink)
        activeLink.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
    }
  }
}
