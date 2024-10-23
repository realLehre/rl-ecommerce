import { inject, Pipe, PipeTransform } from '@angular/core';
import { ProductOptionsService } from '../../features/product-options/services/product-options.service';

@Pipe({
  name: 'numberOfFilters',
  standalone: true,
})
export class NumberOfFiltersPipe implements PipeTransform {
  private optionsService = inject(ProductOptionsService);
  transform(value: unknown): unknown {
    return this.optionsService.checkNumberOfFiltersApplied();
  }
}
