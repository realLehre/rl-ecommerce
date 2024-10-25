import { Pipe, PipeTransform } from '@angular/core';
import { ICartItems } from '../models/cart.interface';

@Pipe({
  name: 'subtotal',
  standalone: true,
})
export class SubtotalPipe implements PipeTransform {
  transform(value: ICartItems[]): number {
    return value.reduce((acc: number, item: ICartItems) => {
      return (acc += item.total);
    }, 0);
  }
}

@Pipe({
  name: 'totalDelivery',
  standalone: true,
})
export class TotalDeliveryPipe implements PipeTransform {
  transform(value: ICartItems[]): any {
    return value.reduce((acc: number, item: ICartItems) => {
      return (acc += item.shippingCost);
    }, 0);
  }
}

@Pipe({
  name: 'grandTotal',
  standalone: true,
})
export class GrandTotalPipe implements PipeTransform {
  transform(value: ICartItems[]): any {
    return value.reduce((acc: number, item: ICartItems) => {
      return (acc += item.shippingCost + item.total);
    }, 0);
  }
}
