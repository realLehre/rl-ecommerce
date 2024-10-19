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

  testEndPoint() {
    // this.http
    //   .post('http://localhost:3000/api/product/create', {
    //     name: 'Typhon Grom Mega 380 Brushed 4X4 Small Scale Buggy RTR',
    //     description:
    //       'Get ready for high-speed thrills with the Typhon Grom Mega 380 Brushed 4X4 Small Scale Buggy RTR! This ready-to-run (RTR) buggy is designed for adventure seekers and RC enthusiasts alike, featuring a powerful brushed motor that delivers exciting performance on a variety of terrains. The 4X4 drivetrain ensures superior traction and stability, allowing you to tackle rough paths, sandy trails, and uneven surfaces with ease. With its compact design, the Typhon Grom is perfect for both indoor and outdoor play, providing excellent maneuverability for quick turns and daring jumps. The buggy comes equipped with durable wheels and a rugged chassis, ensuring it can withstand the rigors of off-road racing. Plus, its eye-catching design, complete with vibrant colors and sleek lines, makes it a standout on the track. This all-in-one package includes everything you need to get started, with a rechargeable battery and charger included. Experience the excitement of racing and off-road exploration with the Typhon Grom Mega 380 Buggy!',
    //     image:
    //       'https://www.arrma-rc.com/dw/image/v2/BFBR_PRD/on/demandware.static/-/Sites-horizon-master/default/dw53ebb83b/Images/ARA/ARA2106T1_A30_0ZRJFBCO.jpg?sw=800&sh=800&sm=fit',
    //     imageUrls: [
    //       'https://www.arrma-rc.com/dw/image/v2/BFBR_PRD/on/demandware.static/-/Sites-horizon-master/default/dw53ebb83b/Images/ARA/ARA2106T1_A30_0ZRJFBCO.jpg?sw=800&sh=800&sm=fit',
    //       'https://www.arrma-rc.com/dw/image/v2/BFBR_PRD/on/demandware.static/-/Sites-horizon-master/default/dw93d256d7/Images/ARA/ARA2106T1_A50_0ZRJFBCO.jpg?sw=800&sh=800&sm=fit',
    //       'https://www.arrma-rc.com/dw/image/v2/BFBR_PRD/on/demandware.static/-/Sites-horizon-master/default/dwf467d2db/Images/ARA/ARA2106T1_A58_0ZRJFBCO.jpg?sw=800&sh=800&sm=fit',
    //       'https://www.arrma-rc.com/dw/image/v2/BFBR_PRD/on/demandware.static/-/Sites-horizon-master/default/dw9e90224a/Images/ARA/ARA2106T1_A11_0ZRJFBCO.jpg?sw=800&sh=800&sm=fit',
    //     ],
    //     videoUrls: [],
    //     price: 73999,
    //     previousPrice: 0,
    //     isSoldOut: false,
    //     unit: 5,
    //     category: {
    //       connect: { id: '8615d61a-6a16-4b73-a3a5-0dbdc41e1814' },
    //     },
    //     subCategory: {
    //       connect: { id: 'b3d74638-09ad-4828-8715-9ec2eac22faa' },
    //     },
    //   })
    //   .subscribe();
    // this.http
    //   .post('http://localhost:3000/api/category/create', {
    //     name: 'Action Figures',
    //     subCategories: [
    //       'Superheroes',
    //       'Movie Characters',
    //       'Video Game Characters',
    //       'Figurine Sets',
    //     ],
    //   })
    //   .subscribe();
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
