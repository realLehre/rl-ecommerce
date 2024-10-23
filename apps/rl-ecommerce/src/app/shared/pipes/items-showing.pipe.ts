import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'itemsShowing',
  standalone: true,
})
export class ItemsShowingPipe implements PipeTransform {
  transform(page: number, total?: number): number {
    if (total) {
      return Math.min(page * 12, total);
    } else {
      return (page - 1) * 12 + 1;
    }
  }
}
