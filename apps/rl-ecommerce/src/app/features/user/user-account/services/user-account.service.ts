import { inject, Injectable, signal } from '@angular/core';
import { AuthService, IUser } from '../../../auth/services/auth.service';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../../environments/environment';
import { of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserAccountService {
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  user = this.authService.user;
  private baseUrl = environment.apiUrl;
  userSignal = signal<IUser | null>(null);

  constructor() {}

  // {name:'Outdoor Toys', subCategories:['Tricycles & Bicycles', 'Playhouses', 'Swing Sets']}

  testEndPoint() {
    this.http
      .post('http://localhost:3000/api/product/create', {
        name: 'Autumn Chic Fashion Doll',
        description:
          'Introducing the Autumn Chic Fashion Doll, a stylish collectible that embodies sophisticated fall fashion. This beautifully crafted doll features long, wavy blonde hair styled in a retro-inspired look with soft curls and a pair of sunglasses perched atop her head. Her face is adorned with subtle yet glamorous makeup, emphasizing her striking features.\n' +
          "The doll wears an intricately designed knit dress that showcases expert craftsmanship. The dress combines deep emerald green with soft pink stripes in a unique pattern. A delicate pink rose embellishment adds a feminine touch to the shoulder. The dress's design includes interesting textures and patterns, making it a standout piece in any doll collection.\n" +
          'Standing at approximately 11.5 inches tall, this doll is perfect for display or for fashion enthusiasts who appreciate miniature couture. The Autumn Chic Fashion Doll would make an excellent gift for collectors, fashion lovers, or anyone who appreciates detailed, high-quality dolls.\n' +
          'Please note that this is a collectible item intended for adult collectors and is not suitable as a toy for young children due to its delicate nature and small accessories.\\',
        image:
          'https://i.pinimg.com/564x/ce/d4/08/ced408c0b2e93e7bd1ebee5d04ef16c4.jpg',
        imageUrls: [
          'https://i.pinimg.com/564x/ce/d4/08/ced408c0b2e93e7bd1ebee5d04ef16c4.jpg',
          'https://i.pinimg.com/564x/f7/27/7d/f7277d534274f4d3989185aa783fdf4f.jpg',
          'https://i.pinimg.com/564x/95/aa/a4/95aaa411c08bef6d9721ebce66ac5d19.jpg',
          'https://i.pinimg.com/564x/14/d1/77/14d177bde0ecf6a7617dc440e9df435e.jpg',
        ],
        videoUrls: [],
        price: 5999,
        previousPrice: 0,
        isSoldOut: false,
        unit: 12,
        category: {
          connect: { id: 'c7feff28-5de1-4c55-bd28-29c333541a8a' },
        },
        subCategory: {
          connect: { id: 'd4c97084-52c0-42e6-b3d4-a931960a3432' },
        },
      })
      .subscribe();

    // this.http.post('http://localhost:3000/api/category/create')
  }
  getUser() {
    return this.userSignal()
      ? of(this.userSignal())
      : this.http
          .get<IUser>(`${this.baseUrl}users/${this.user()?.id}`)
          .pipe(tap((res) => this.userSignal.set(res)));
  }

  updateUser(data: any) {
    return this.http
      .patch<any | IUser>(`${this.baseUrl}users/${this.user()?.id}`, data)
      .pipe(tap((res) => this.userSignal.set(res)));
  }
}
