import {
  Directive,
  ElementRef,
  inject,
  input,
  OnInit,
  Renderer2,
} from '@angular/core';
import { IDeliveryEvents } from '../../../../../../shared/models/order.interface';

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
  timeLine = input.required<IDeliveryEvents[]>();
  status = input.required<IDeliveryEvents>();
  completeImageSrc: string = 'assets/images/icons/green-tick.svg';
  firstWaitingImageSrc: string = 'assets/images/icons/order-loading.svg';
  blankImageSrc: string = 'assets/images/icons/order-blank.svg';

  ngOnInit() {
    this.changeSrc(this.status().status);
  }

  changeSrc(event: string) {
    const lastCompletedIndex = this.timeLine().reduceRight(
      (acc, status, index) => {
        return acc !== -1 ? acc : status.status ? index : -1;
      },
      -1,
    );

    const indexOfStatus = this.timeLine().findIndex(
      (status) => status.remark == this.status().remark,
    );

    if (event) {
      this.setImageSrc(this.completeImageSrc);
    } else {
      this.setImageSrc(this.blankImageSrc);
    }
    if (!event && indexOfStatus - lastCompletedIndex == 1) {
      this.setImageSrc(this.firstWaitingImageSrc);
    }
  }

  setImageSrc(imageSrc: string) {
    this.renderer.setProperty(this.el.nativeElement, 'src', imageSrc);
  }
}

@Directive({
  selector: '[appOrderStatusLine]',
  standalone: true,
})
export class OrderStatusLine implements OnInit {
  private renderer = inject(Renderer2);
  private el = inject(ElementRef);
  timeLine = input.required<IDeliveryEvents[]>();
  status = input.required<IDeliveryEvents>();

  ngOnInit() {
    this.changeLineColor(this.status().status);
  }

  changeLineColor(status: any) {
    const lastCompletedIndex = this.timeLine().reduceRight(
      (acc: any, event: IDeliveryEvents, index) => {
        return acc !== -1 ? acc : event.status ? index : -1;
      },
      -1,
    );

    const indexOfStatus = this.timeLine().findIndex(
      (event) => event.remark == this.status().remark,
    );
    if (status && indexOfStatus - lastCompletedIndex !== 0) {
      this.renderer.addClass(this.el.nativeElement, 'bg-[#2E7D32]');
    } else {
      this.renderer.addClass(this.el.nativeElement, 'bg-[#DCDCDC]');
    }
  }
}
