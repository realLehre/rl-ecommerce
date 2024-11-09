import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pricePercentageDecrease',
  standalone: true,
})
export class PricePercentageDecreasePipe implements PipeTransform {
  transform(value: number, previousPrice: number): number {
    const deference = previousPrice - value;
    return Math.round((deference / previousPrice) * 100);
  }
}
