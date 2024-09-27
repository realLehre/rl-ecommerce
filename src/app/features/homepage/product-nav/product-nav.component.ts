import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-product-nav',
  standalone: true,
  imports: [NgClass],
  templateUrl: './product-nav.component.html',
  styleUrl: './product-nav.component.scss',
})
export class ProductNavComponent implements OnInit {
  categories: { title: string }[] = [
    { title: 'ALL' },
    { title: 'SUPERHEROES' },
    { title: 'Movie & TV Characters' },
    { title: 'Robots & Cyborgs' },
    { title: 'Playsets & Accessories' },
  ];

  currentCategory = 'all';

  ngOnInit() {}

  onViewCategory(title: string) {
    this.currentCategory = title.toLowerCase();
  }
}
