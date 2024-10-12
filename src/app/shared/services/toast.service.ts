import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

interface IToastInfo {
  type: 'error' | 'warn' | 'success';
  summary: 'Error' | 'Warn' | 'Success';
  message: string | undefined;
}
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private messageService = inject(MessageService);
  constructor() {}

  showToast(info: IToastInfo) {
    console.log(info);
    this.messageService.add({
      severity: info.type,
      summary: info.summary,
      detail: info.message,
    });
  }
}
