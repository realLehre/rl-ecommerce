import { Component, input, OnInit } from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [NgStyle],
  template: `<div class="flex items-center justify-center">
    <div class="loader" [ngStyle]="getStyle()"></div>
  </div>`,
  styles: `
    .loader {
      border-radius: 50%;
      display: inline-block;
      box-sizing: border-box;
      animation: rotation 1s linear infinite;
    }

    @keyframes rotation {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `,
})
export class LoaderComponent implements OnInit {
  customStyle = input<{ width: string; border: string }>();

  ngOnInit() {}

  getStyle() {
    return {
      width: this.customStyle()?.width || '48px',
      height: this.customStyle()?.width || '48px',
      border: this.customStyle()?.border || '5px solid #fff',
      'border-bottom-color': 'transparent',
    };
  }
}
