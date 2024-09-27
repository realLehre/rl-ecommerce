import { Component, OnInit } from '@angular/core';
import { ProductCardComponent } from './product-card/product-card.component';

@Component({
  selector: 'app-products-showcase',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './products-showcase.component.html',
  styleUrl: './products-showcase.component.scss',
})
export class ProductsShowcaseComponent implements OnInit {
  products: {
    image: string;
    name: string;
    price: number;
    rating: number;
    id: string;
  }[] = [
    {
      image: 'assets/images/toy-1.jpeg',
      name: 'Power Rangers',
      price: 10000,
      rating: 23,
      id: '27162272728822',
    },
    {
      image: 'assets/images/toy-5.jpeg',
      name: 'Robo-Pup',
      price: 7999,
      rating: 18,
      id: '38291047583920',
    },
    {
      image: 'assets/images/toy-2.jpeg',
      name: 'Galactic Blaster',
      price: 5499,
      rating: 21,
      id: '90187365429876',
    },
    {
      image: 'assets/images/toy-8.jpeg',
      name: 'Plush Unicorn',
      price: 2999,
      rating: 25,
      id: '12398745602187',
    },
    {
      image: 'assets/images/toy-3.jpeg',
      name: 'Mega Blocks Set',
      price: 8999,
      rating: 20,
      id: '65432198709876',
    },
    {
      image: 'assets/images/toy-7.jpeg',
      name: 'RC Monster Truck',
      price: 12999,
      rating: 22,
      id: '78901234567890',
    },
    {
      image: 'assets/images/toy-4.jpeg',
      name: 'Magic Wand',
      price: 1999,
      rating: 19,
      id: '23456789012345',
    },
    {
      image: 'assets/images/toy-9.jpeg',
      name: 'Dino Explorer Kit',
      price: 6499,
      rating: 24,
      id: '34567890123456',
    },
    {
      image: 'assets/images/toy-6.jpeg',
      name: 'Bubble Machine',
      price: 3499,
      rating: 17,
      id: '45678901234567',
    },
    {
      image: 'assets/images/toy-10.png',
      name: 'Pirate Ship Playset',
      price: 9999,
      rating: 21,
      id: '56789012345678',
    },
    {
      image: 'assets/images/toy-1.jpeg',
      name: 'Musical Keyboard',
      price: 4999,
      rating: 20,
      id: '67890123456789',
    },
    {
      image: 'assets/images/toy-3.jpeg',
      name: 'Superhero Costume',
      price: 3999,
      rating: 18,
      id: '78901234567891',
    },
    {
      image: 'assets/images/toy-5.jpeg',
      name: 'Art Easel Set',
      price: 5999,
      rating: 23,
      id: '89012345678901',
    },
    {
      image: 'assets/images/toy-7.jpeg',
      name: 'Talking Parrot',
      price: 2499,
      rating: 16,
      id: '90123456789012',
    },
    {
      image: 'assets/images/toy-2.jpeg',
      name: 'Science Lab Kit',
      price: 7499,
      rating: 22,
      id: '01234567890123',
    },
    {
      image: 'assets/images/toy-4.jpeg',
      name: 'Ninja Warrior Set',
      price: 6999,
      rating: 19,
      id: '12345678901234',
    },
  ];
  ngOnInit() {}
}
