import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deliveryEventRemark',
  standalone: true,
})
export class DeliveryEventRemarkPipe implements PipeTransform {
  transform(value: string): string {
    switch (value.toLowerCase()) {
      case 'customer paid':
        return 'Verified';
      case 'order confirmed':
        return 'Confirmed';
      case 'order assigned for delivery':
        return 'Packed';
      case 'order delivered':
        return 'Delivered';
    }
    return '';
  }
}
