import {
  Directive,
  ElementRef,
  inject,
  input,
  OnInit,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appOrderStatus]',
  standalone: true,
})
export class OrderStatusDirective implements OnInit {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  orderStatus = input.required<string>({ alias: 'appOrderStatus' });
  constructor() {}

  ngOnInit() {
    this.renderer.setStyle(
      this.el.nativeElement,
      'background-color',
      this.getStatusClass(this.orderStatus()),
    );

    this.renderer.setStyle(
      this.el.nativeElement,
      'color',
      this.getTextColor(this.orderStatus()),
    );
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#FDEBF4';
      case 'packed':
        return '#E1E2FC';
      case 'delivered':
        return '#DBF9E9';
      default:
        return 'bg-gray-200';
    }
  }

  getTextColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#8B0E4D';
      case 'packed':
        return '#0E138B';
      case 'delivered':
        return '#0A8B46';
      default:
        return 'bg-gray-200';
    }
  }
}
