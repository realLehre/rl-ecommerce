import { Component, OnInit } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';

@Component({
  selector: 'app-product-details-images',
  standalone: true,
  imports: [GalleriaModule],
  templateUrl: './product-details-images.component.html',
  styleUrl: './product-details-images.component.scss',
})
export class ProductDetailsImagesComponent implements OnInit {
  images = [
    'assets/images/toy-5.jpeg',
    'assets/images/toy-1.jpeg',
    'assets/images/toy-2.jpeg',
    'assets/images/toy-3.jpeg',
    'assets/images/toy-4.jpeg',
    'assets/images/toy-10.png',
    'assets/images/toy-9.jpeg',
  ];
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
