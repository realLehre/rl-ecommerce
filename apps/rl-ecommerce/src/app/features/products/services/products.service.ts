import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { IProduct } from '../model/product.interface';
import { of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + 'product/';
  productSignal = signal<IProduct[] | null>(null);
  activeProduct = signal<IProduct | null>(null);

  products = [
    {
      image: 'assets/images/toy-1.jpeg',
      name: 'Power Rangers',
      price: 100000,
      rating: 23,
      id: '27162272728822',
      itemsLeft: 13,
    },
    {
      image: 'assets/images/toy-5.jpeg',
      name: 'Robo-Pup',
      price: 7999,
      rating: 18,
      id: '38291047583920',
      itemsLeft: 89,
    },
    {
      image: 'assets/images/toy-2.jpeg',
      name: 'Galactic Blaster',
      price: 5499,
      rating: 21,
      id: '90187365429876',
      itemsLeft: 77,
    },
    {
      image: 'assets/images/toy-8.jpeg',
      name: 'Plush Unicorn',
      price: 2999,
      rating: 25,
      id: '12398745602187',
      itemsLeft: 78,
    },
    {
      image: 'assets/images/toy-3.jpeg',
      name: 'Mega Blocks Set',
      price: 8999,
      rating: 20,
      id: '65432198709876',
      itemsLeft: 8,
    },
    {
      image: 'assets/images/toy-7.jpeg',
      name: 'RC Monster Truck',
      price: 12999,
      rating: 22,
      id: '78901234567890',
      itemsLeft: 39,
    },
    {
      image: 'assets/images/toy-4.jpg',
      name: 'Magic Wand',
      price: 1999,
      rating: 19,
      id: '23456789012345',
      itemsLeft: 4,
    },
    {
      image: 'assets/images/toy-9.jpeg',
      name: 'Dino Explorer Kit',
      price: 6499,
      rating: 24,
      id: '34567890123456',
      itemsLeft: 36,
    },
    {
      image: 'assets/images/toy-6.jpeg',
      name: 'Bubble Machine',
      price: 3499,
      rating: 17,
      id: '45678901234567',
      itemsLeft: 2,
    },
    {
      image: 'assets/images/toy-10.png',
      name: 'Pirate Ship Playset',
      price: 9999,
      rating: 21,
      id: '56789012345678',
      itemsLeft: 4,
    },
    {
      image: 'assets/images/toy-1.jpeg',
      name: 'Musical Keyboard',
      price: 4999,
      rating: 20,
      id: '67890123456789',
      itemsLeft: 87,
    },
    {
      image: 'assets/images/toy-3.jpeg',
      name: 'Superhero Costume',
      price: 3999,
      rating: 18,
      id: '78901234567891',
      itemsLeft: 60,
    },
    {
      image: 'assets/images/toy-5.jpeg',
      name: 'Art Easel Set',
      price: 5999,
      rating: 23,
      id: '89012345678901',
      itemsLeft: 37,
    },
    {
      image: 'assets/images/toy-7.jpeg',
      name: 'Talking Parrot',
      price: 2499,
      rating: 16,
      id: '90123456789012',
      itemsLeft: 66,
    },
    {
      image: 'assets/images/toy-2.jpeg',
      name: 'Science Lab Kit',
      price: 7499,
      rating: 22,
      id: '01234567890123',
      itemsLeft: 40,
    },
    {
      image: 'assets/images/toy-4.jpg',
      name: 'Ninja Warrior Set',
      price: 6999,
      rating: 19,
      id: '12345678901234',
      itemsLeft: 39,
    },
  ];

  constructor() {}

  getProducts() {
    return this.productSignal()
      ? of(this.productSignal())
      : this.http
          .get<IProduct[]>(`${this.baseUrl}all`)
          .pipe(tap((res) => this.productSignal.set(res)));
  }

  getProductById(id: string) {
    return this.http.get<IProduct>(`${this.baseUrl}${id}`);
  }

  getSimilarProducts(categoryId: string, productId: string) {
    return this.http.get<IProduct[]>(
      `${this.baseUrl}${productId}/similar/${categoryId}`,
    );
  }
}
