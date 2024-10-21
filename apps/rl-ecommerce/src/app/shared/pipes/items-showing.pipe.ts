import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'itemsShowing',
  standalone: true,
})
export class ItemsShowingPipe implements PipeTransform {
  transform(page: number): number {
    return (page + 1) * 10 - 19;
  }
}
