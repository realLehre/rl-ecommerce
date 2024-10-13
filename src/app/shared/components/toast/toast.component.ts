import { Component, input, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [NgClass],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  toastInfo = input<{ type: 'warn' | 'error' | 'success'; message: string }>({
    type: 'success',
    message: 'Item added to cart successfully',
  });
}
