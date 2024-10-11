import {
  Directive,
  ElementRef,
  inject,
  input,
  OnInit,
  Renderer2,
} from '@angular/core';

interface IOrderStatus {
  label: string;
  date: string;
  isComplete: boolean;
}
@Directive({
  selector: '[appOrderStatusIcon]',
  standalone: true,
})
export class OrderStatusIconDirective implements OnInit {
  private renderer = inject(Renderer2);
  private el = inject(ElementRef);
  timeLine = input.required<IOrderStatus[]>();
  status = input.required<IOrderStatus>();
  completeImageSrc: string = 'assets/images/icons/green-tick.svg';
  firstWaitingImageSrc: string = 'assets/images/icons/order-loading.svg';
  blankImageSrc: string = 'assets/images/icons/order-blank.svg';

  ngOnInit() {
    this.changeSrc(this.status().isComplete);
  }

  changeSrc(status: boolean) {
    const lastCompletedIndex = this.timeLine().reduceRight(
      (acc, status, index) => {
        return acc !== -1 ? acc : status.isComplete ? index : -1;
      },
      -1,
    );
    const indexOfStatus = this.timeLine().findIndex(
      (status) => status.label == this.status().label,
    );
    if (status) {
      this.setImageSrc(this.completeImageSrc);
    } else {
      this.setImageSrc(this.blankImageSrc);
    }
    if (!status && indexOfStatus - lastCompletedIndex == 1) {
      this.setImageSrc(this.firstWaitingImageSrc);
    }
  }

  setImageSrc(imageSrc: string) {
    this.renderer.setProperty(this.el.nativeElement, 'src', imageSrc);
  }
}
