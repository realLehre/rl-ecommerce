import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { SliderModule } from 'primeng/slider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductOptionsService } from '../services/product-options.service';
import { ProductsService } from '../../products/services/products.service';
import { ISavedProductOptionQueries } from '../models/product-options.interface';
import { LayoutService } from '../../../shared/services/layout.service';
import { NumberOfFiltersPipe } from '../../../shared/pipes/number-of-filters.pipe';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [
    NgClass,
    SliderModule,
    ReactiveFormsModule,
    CheckboxModule,
    FormsModule,
    DecimalPipe,
    NumberOfFiltersPipe,
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private optionsService = inject(ProductOptionsService);
  private layoutService = inject(LayoutService);
  private productService = inject(ProductsService);
  isShowing = signal<boolean[]>([true, true]);
  currentPriceFilter = this.optionsService.currentPriceFilter;
  rangeValues = computed(() => {
    if (this.currentPriceFilter()) {
      return [this.currentPriceFilter()?.min, this.currentPriceFilter()?.max];
    } else {
      return [2000, 10000];
    }
  });
  value: number = 50;
  currentSort = this.optionsService.currentSort;

  onApplyPriceFilter() {
    this.productService.productSignal.set(null);
    this.optionsService.currentPage.set(1);
    this.optionsService.currentPriceFilter.set({
      min: this.rangeValues()[0],
      max: this.rangeValues()[1],
    });
    this.layoutService.mobileFilterOpened.set(false);

    const savedQuery: ISavedProductOptionQueries = JSON.parse(
      sessionStorage.getItem('hshs82haa02sshs92s')!,
    );

    sessionStorage.setItem(
      'hshs82haa02sshs92s',
      JSON.stringify({
        ...savedQuery,
        price: { min: this.rangeValues()[0], max: this.rangeValues()[1] },
      }),
    );

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        minPrice: this.rangeValues()[0],
        maxPrice: this.rangeValues()[1],
        page: null,
      },
      queryParamsHandling: 'merge',
      fragment: 'products',
    });
  }

  onRangeValuesChange(event: any) {
    this.currentPriceFilter.set(null);
  }

  onSetOrder(sort: string) {
    this.layoutService.mobileFilterOpened.set(false);
    if (
      this.currentSort() === sort ||
      (!this.currentSort() && sort === 'old')
    ) {
      return;
    }
    this.productService.productSignal.set(null);
    this.optionsService.currentSort.set(sort);

    const savedQuery: ISavedProductOptionQueries = JSON.parse(
      sessionStorage.getItem('hshs82haa02sshs92s')!,
    );

    sessionStorage.setItem(
      'hshs82haa02sshs92s',
      JSON.stringify({ ...savedQuery, sort }),
    );

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort,
      },
      queryParamsHandling: 'merge',
      fragment: 'products',
    });
  }

  onClearFilter() {
    this.productService.productSignal.set(null);
    this.optionsService.currentSort.set(null);
    this.optionsService.currentPriceFilter.set(null);
    this.layoutService.mobileFilterOpened.set(false);

    const savedQuery: ISavedProductOptionQueries = JSON.parse(
      sessionStorage.getItem('hshs82haa02sshs92s')!,
    );
    if (savedQuery?.price) {
      delete savedQuery.price;
    }
    if (savedQuery?.sort) {
      delete savedQuery.sort;
    }

    this.currentPriceFilter.set(null);

    sessionStorage.setItem('hshs82haa02sshs92s', JSON.stringify(savedQuery));

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        minPrice: null,
        maxPrice: null,
        sort: null,
      },
      queryParamsHandling: 'merge',
      fragment: 'products',
    });
  }

  onToggleFilter(index: number) {
    const newArray = [...this.isShowing()];
    newArray[index] = !newArray[index];

    this.isShowing.set(newArray);
  }
}
