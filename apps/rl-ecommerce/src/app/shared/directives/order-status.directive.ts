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
  orderStatus = input.required<string>();
  constructor() {}

  ngOnInit() {
    this.renderer.addClass(
      this.el.nativeElement,
      this.getStatusClass(this.orderStatus()),
    );

    this.renderer.addClass(
      this.el.nativeElement,
      this.getTextColor(this.orderStatus()),
    );
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-pink-200';
      case 'payment confirmed':
        return 'bg-blue-200';
      case 'packing':
        return 'bg-purple-200';
      case 'delivered':
        return 'bg-green-200';
      default:
        return 'bg-gray-200';
    }
  }

  getTextColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'payment pending':
        return 'text-pink-800';
      case 'payment confirmed':
        return 'text-blue-800';
      case 'packing order':
        return 'text-purple-800';
      case 'order delivered':
        return 'text-green-800';
      default:
        return 'text-gray-800';
    }
  }
}
