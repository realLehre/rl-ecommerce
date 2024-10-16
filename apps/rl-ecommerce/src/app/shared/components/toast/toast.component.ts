import { Component, inject, input, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [NgClass],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  private toastService = inject(ToastService);
  toastInfo = signal<{
    type: 'warn' | 'error' | 'success';
    message: string;
  }>({
    type: 'success',
    message: 'Item added to cart successfully',
  });

  onCloseToast() {
    this.toastService.hideToast();
  }
}
