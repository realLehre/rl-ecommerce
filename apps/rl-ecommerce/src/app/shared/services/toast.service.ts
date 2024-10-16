import {  Injectable, ViewContainerRef } from '@angular/core';

import { ToastComponent } from '../components/toast/toast.component';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  vcr!: ViewContainerRef;
  timeOut: any = null;
  constructor() {}

  showToast(info: { type: 'warn' | 'error' | 'success'; message: string }) {
    this.hideToast();

    const toastComponent = this.vcr.createComponent(ToastComponent);

    toastComponent.instance.toastInfo.set({
      type: info.type,
      message: info.message,
    });

    this.timeOut = setTimeout(() => {
      this.hideToast();
    }, 3000);
  }

  hideToast() {
    if (this.timeOut) {
      clearTimeout(this.timeOut);
    }
    this.vcr.clear();
  }
}
