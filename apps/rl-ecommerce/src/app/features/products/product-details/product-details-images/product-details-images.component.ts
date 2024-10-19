import { Component, input, OnInit } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';

@Component({
  selector: 'app-product-details-images',
  standalone: true,
  imports: [GalleriaModule],
  templateUrl: './product-details-images.component.html',
  styleUrl: './product-details-images.component.scss',
})
export class ProductDetailsImagesComponent implements OnInit {
  images = input<string[]>([]);
  responsiveOptions: any[] | undefined;
  ngOnInit() {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 5,
      },
      {
        breakpoint: '850px',
        numVisible: 3,
      },
      {
        breakpoint: '560px',
        numVisible: 1,
      },
    ];
  }
}
