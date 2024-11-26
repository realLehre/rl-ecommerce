import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[stop-click-propagation]',
  standalone: true,
})
export class PrimeNgDatepickerDirective {
  @HostListener('click', ['$event'])
  public onClick(event: any): void {
    event.stopPropagation();
  }

  @HostListener('mousedown', ['$event'])
  public onMousedown(event: any): void {
    event.stopPropagation();
  }
}
