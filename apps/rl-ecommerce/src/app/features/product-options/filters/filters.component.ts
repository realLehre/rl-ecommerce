import {
  ChangeDetectionStrategy,
  Component,
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
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private optionsService = inject(ProductOptionsService);
  private productService = inject(ProductsService);
  isShowing = signal<boolean[]>([true, true]);
  // rangeValues = new FormControl([20, 30]);
  rangeValues = [2000, 10000];
  value: number = 50;
  currentSort = this.optionsService.currentSort;

  ngOnInit() {
    // console.log(this.isShowing);
    // this.rangeValues.valueChanges.subscribe((val) => {
    //   console.log(val);
    // });
  }

  onApplyPriceFilter() {
    console.log(this.rangeValues);
    this.productService.productSignal.set(null);
    this.optionsService.currentPage.set(1);
    this.optionsService.currentPriceFilter.set({
      min: this.rangeValues[0],
      max: this.rangeValues[1],
    });

    const savedQuery: ISavedProductOptionQueries = JSON.parse(
      sessionStorage.getItem('hshs82haa02sshs92s')!,
    );

    sessionStorage.setItem(
      'hshs82haa02sshs92s',
      JSON.stringify({
        ...savedQuery,
        price: { min: this.rangeValues[0], max: this.rangeValues[1] },
      }),
    );

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        minPrice: this.rangeValues[0],
        maxPrice: this.rangeValues[1],
        page: null,
      },
      queryParamsHandling: 'merge',
      fragment: 't',
    });
  }

  onSetOrder(sort: string) {
    if (this.currentSort() === sort) {
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
      fragment: 't',
    });
  }

  onToggleFilter(index: number) {
    const newArray = [...this.isShowing()];
    newArray[index] = !newArray[index];

    this.isShowing.set(newArray);
  }
}
