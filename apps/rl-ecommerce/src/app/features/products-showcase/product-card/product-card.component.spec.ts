// import { ComponentFixture, TestBed } from '@angular/core/testing';
//
// import { ProductCardComponent } from './product-card.component';
// import { provideHttpClientTesting } from '@angular/common/http/testing';
// import { ProductsService } from '../../products/services/products.service';
// import { provideHttpClient } from '@angular/common/http';
// import { ToastService } from '../../../shared/services/toast.service';
// import { CartService } from '../../../shared/services/cart.service';
// import { UserAccountService } from '../../user/user-account/services/user-account.service';
// import { ReviewService } from '../../../shared/services/review.service';
// import { provideRouter } from '@angular/router';
// import { provideStore } from '@ngrx/store';
// import { DialogService } from 'primeng/dynamicdialog';
//
// fdescribe('ProductCardComponent', () => {
//   let component: ProductCardComponent;
//   let fixture: ComponentFixture<ProductCardComponent>;
//
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [ProductCardComponent],
//       providers: [
//         provideHttpClientTesting(),
//         provideHttpClient(),
//         ProductsService,
//         ToastService,
//         CartService,
//         UserAccountService,
//         ReviewService,
//         provideRouter([]),
//         provideStore(),
//         DialogService,
//       ],
//     }).compileComponents();
//
//     fixture = TestBed.createComponent(ProductCardComponent);
//     component = fixture.componentInstance;
//     fixture.componentRef.setInput('product', {
//       id: 1,
//       name: 'whatever',
//       ratings: [],
//     });
//     await fixture.whenStable();
//     fixture.detectChanges();
//   });
//
//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
//
//   it('should have a title', () => {
//     expect(component.ProductCard).toBeDefined();
//   });
// });

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { Router } from '@angular/router';
import { ProductsService } from '../../products/services/products.service';
import { ToastService } from '../../../shared/services/toast.service';
import { CartService } from '../../../shared/services/cart.service';
import { UserAccountService } from '../../user/user-account/services/user-account.service';
import { ReviewService } from '../../../shared/services/review.service';
import { Store } from '@ngrx/store';
import { BehaviorSubject, map, of } from 'rxjs';
import {
  IProduct,
  IProductRating,
} from '../../products/model/product.interface';
import { CurrencyPipe } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ProductQuantityComponent } from '../../../shared/components/product-quantity/product-quantity.component';
import { PricePercentageDecreasePipe } from '../../../shared/pipes/price-percentage-decrease.pipe';
import { provideHttpClient } from '@angular/common/http';
import { signal, WritableSignal } from '@angular/core';

fdescribe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let productServiceSpy: jasmine.SpyObj<ProductsService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let userServiceSpy: jasmine.SpyObj<UserAccountService>;
  let reviewServiceSpy: jasmine.SpyObj<ReviewService>;
  let storeSpy: jasmine.SpyObj<Store>;

  const mockProduct: IProduct = {
    id: 'd36b53fb-f08b-4b6f-9360-a904c52f2eb8',
    name: 'Typhon Grom Mega 380 Brushed 4X4 Small Scale Buggy RTR',
    description:
      'Get ready for high-speed thrills with the Typhon Grom Mega 380 Brushed 4X4 Small Scale Buggy RTR! This ready-to-run (RTR) buggy is designed for adventure seekers and RC enthusiasts alike, featuring a powerful brushed motor that delivers exciting performance on a variety of terrains. The 4X4 drivetrain ensures superior traction and stability, allowing you to tackle rough paths, sandy trails, and uneven surfaces with ease. With its compact design, the Typhon Grom is perfect for both indoor and outdoor play, providing excellent maneuverability for quick turns and daring jumps. The buggy comes equipped with durable wheels and a rugged chassis, ensuring it can withstand the rigors of off-road racing. Plus, its eye-catching design, complete with vibrant colors and sleek lines, makes it a standout on the track. This all-in-one package includes everything you need to get started, with a rechargeable battery and charger included. Experience the excitement of racing and off-road exploration with the Typhon Grom Mega 380 Buggy!',
    image:
      'https://tentdyesixetvyacewwr.supabase.co/storage/v1/object/sign/just-product-images/d117ee00-d89e-4e79-87a7-03fef97575b8-ARA2106T1_A30_0ZRJFBCO.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJqdXN0LXByb2R1Y3QtaW1hZ2VzL2QxMTdlZTAwLWQ4OWUtNGU3OS04N2E3LTAzZmVmOTc1NzViOC1BUkEyMTA2VDFfQTMwXzBaUkpGQkNPLmpwZyIsImlhdCI6MTczNjMzMDgzNiwiZXhwIjoyMDUxOTA2ODM2fQ.I6n75C4i1RSi2ipSWtc3T2otp4OAiDB4aHC0ZVEGSdU',
    imageUrls: [
      'https://tentdyesixetvyacewwr.supabase.co/storage/v1/object/sign/just-product-images/d117ee00-d89e-4e79-87a7-03fef97575b8-ARA2106T1_A30_0ZRJFBCO.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJqdXN0LXByb2R1Y3QtaW1hZ2VzL2QxMTdlZTAwLWQ4OWUtNGU3OS04N2E3LTAzZmVmOTc1NzViOC1BUkEyMTA2VDFfQTMwXzBaUkpGQkNPLmpwZyIsImlhdCI6MTczNjMzMDgzNiwiZXhwIjoyMDUxOTA2ODM2fQ.I6n75C4i1RSi2ipSWtc3T2otp4OAiDB4aHC0ZVEGSdU',
      'https://tentdyesixetvyacewwr.supabase.co/storage/v1/object/sign/just-product-images/1ea0c912-337a-4269-bb6a-a7ceeb81b98f-ARA2106T1_A11_0ZRJFBCO.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJqdXN0LXByb2R1Y3QtaW1hZ2VzLzFlYTBjOTEyLTMzN2EtNDI2OS1iYjZhLWE3Y2VlYjgxYjk4Zi1BUkEyMTA2VDFfQTExXzBaUkpGQkNPLmpwZyIsImlhdCI6MTczNjMzMDgzOSwiZXhwIjoyMDUxOTA2ODM5fQ.koJJYOwM4Y7hmyqm3Nwrmw_0ZjSsAyg9w6XPGUzrneE',
      'https://tentdyesixetvyacewwr.supabase.co/storage/v1/object/sign/just-product-images/d259c128-adcd-4f4f-bad1-b9ef72f5659a-ARA2106T1_A50_0ZRJFBCO.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJqdXN0LXByb2R1Y3QtaW1hZ2VzL2QyNTljMTI4LWFkY2QtNGY0Zi1iYWQxLWI5ZWY3MmY1NjU5YS1BUkEyMTA2VDFfQTUwXzBaUkpGQkNPLmpwZyIsImlhdCI6MTczNjMzMDg0NCwiZXhwIjoyMDUxOTA2ODQ0fQ.dbjlSHRsVkd7sB5-ffPbNg5AGsHQkSplCh7tqwTo1Ug',
      'https://tentdyesixetvyacewwr.supabase.co/storage/v1/object/sign/just-product-images/26417a1e-4a12-4041-8bb2-abd81dc854e4-ARA2106T1_A58_0ZRJFBCO.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJqdXN0LXByb2R1Y3QtaW1hZ2VzLzI2NDE3YTFlLTRhMTItNDA0MS04YmIyLWFiZDgxZGM4NTRlNC1BUkEyMTA2VDFfQTU4XzBaUkpGQkNPLmpwZyIsImlhdCI6MTczNjMzMDg0OCwiZXhwIjoyMDUxOTA2ODQ4fQ.pqFTj-J5Taq2gdz2GPEwVvKZMtyaTzgUZCyW4_bo4Ik',
    ],
    videoUrls: [],
    price: 73999,
    previousPrice: 0,
    isSoldOut: false,
    unit: 17,
    categoryId: '8615d61a-6a16-4b73-a3a5-0dbdc41e1814',
    subCategoryId: 'b3d74638-09ad-4828-8715-9ec2eac22faa',
    createdAt: '2024-10-19T16:13:47.602Z',
    updateAt: '2025-01-08T10:07:29.820Z',
    category: {
      id: '8615d61a-6a16-4b73-a3a5-0dbdc41e1814',
      name: 'Vehicles & Remote Controlled Toys',
      createdAt: '2024-10-19T14:48:27.470Z',
      updateAt: '2024-10-19T14:48:27.470Z',
    },
    subCategory: {
      id: 'b3d74638-09ad-4828-8715-9ec2eac22faa',
      name: 'RC Cars',
      categoryId: '8615d61a-6a16-4b73-a3a5-0dbdc41e1814',
      createdAt: '2024-10-19T14:48:27.470Z',
      updateAt: '2024-10-19T14:48:27.470Z',
    },
    ratings: [
      {
        id: '407f6a21-3ca2-44be-92fd-5b58b88c72a4',
        rating: 3,
        title: 'Good product',
        comment: 'Its really nice',
        createdAt: '2024-11-10T20:47:40.654Z',
        productId: 'd36b53fb-f08b-4b6f-9360-a904c52f2eb8',
        orderItemId: '8e2d9c26-9d09-42d1-a3da-6a647d89a6c6',
        userId: '91432a69-ef7f-46d3-a50f-f46a1e3da5ab',
        user: {
          id: '91432a69-ef7f-46d3-a50f-f46a1e3da5ab',
          email: 'hey@hey.hey',
          name: 'Bjorn Kate',
          phoneNumber: '081067103242',
          createdAt: '2024-10-15T15:26:57.543Z',
          updateAt: '2025-01-05T05:55:25.196Z',
        },
      },
    ],
  };

  const initialCartState = {
    cart: {
      id: '1',
      cartItems: [],
      total: 0,
    },
    error: null,
    status: 'pending',
    loadingOperations: {
      add: { loading: false, status: 'idle' },
      update: { loading: false, status: 'idle' },
      delete: { loading: false, status: 'idle' },
      error: null,
      productId: null,
    },
    merge: {
      error: null,
      status: 'pending',
      isIdle: true,
    },
  };

  const cartState$ = new BehaviorSubject(initialCartState);
  const loadingOperations$ = new BehaviorSubject({
    add: { loading: false, status: 'idle' },
    update: { loading: false, status: 'idle' },
    delete: { loading: false, status: 'idle' },
    error: null,
    productId: null,
  });
  let activeProductSignal: WritableSignal<IProduct | null>;
  let seeingFullReviewSignal: WritableSignal<boolean>;
  beforeEach(async () => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const productServiceSpyObj = jasmine.createSpyObj('ProductsService', [
      'createSlug',
      'getProductCartStarWidth',
      { activeProduct: activeProductSignal },
    ]);
    const toastServiceSpyObj = jasmine.createSpyObj('ToastService', [
      'showToast',
    ]);
    const cartServiceSpyObj = jasmine.createSpyObj(
      'CartService',
      ['createGuestCart'],
      { user: of(null), guestCart: {} },
    );
    const userServiceSpyObj = jasmine.createSpyObj('UserAccountService', [], {
      user: of(null),
    });
    const reviewServiceSpyObj = jasmine.createSpyObj('ReviewService', [], {
      seeingFullReview: seeingFullReviewSignal,
    });
    const storeSpyObj = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    storeSpyObj.select.and.callFake((selector: any) => {
      if (selector.name === 'selectCart') {
        return cartState$.pipe(map((state) => state.cart));
      }
      if (selector.name === 'selectCartLoadingOperations') {
        return loadingOperations$;
      }
      return of(null);
    });

    await TestBed.configureTestingModule({
      imports: [
        ProductCardComponent,
        CurrencyPipe,
        SkeletonModule,
        LoaderComponent,
        ProductQuantityComponent,
        PricePercentageDecreasePipe,
      ],
      providers: [
        provideHttpClient(),
        { provide: Router, useValue: routerSpyObj },
        { provide: ProductsService, useValue: productServiceSpyObj },
        { provide: ToastService, useValue: toastServiceSpyObj },
        { provide: CartService, useValue: cartServiceSpyObj },
        { provide: UserAccountService, useValue: userServiceSpyObj },
        { provide: ReviewService, useValue: reviewServiceSpyObj },
        { provide: Store, useValue: storeSpyObj },
      ],
    }).compileComponents();

    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    productServiceSpy = TestBed.inject(
      ProductsService,
    ) as jasmine.SpyObj<ProductsService>;
    toastServiceSpy = TestBed.inject(
      ToastService,
    ) as jasmine.SpyObj<ToastService>;
    cartServiceSpy = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    userServiceSpy = TestBed.inject(
      UserAccountService,
    ) as jasmine.SpyObj<UserAccountService>;
    reviewServiceSpy = TestBed.inject(
      ReviewService,
    ) as jasmine.SpyObj<ReviewService>;
    storeSpy = TestBed.inject(Store) as jasmine.SpyObj<Store>;

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize productId on ngOnInit', () => {
    expect(component.productId()).toBe(mockProduct.id);
  });

  it('should calculate average rating correctly', () => {
    expect(component.averageRating()).toBe(3);
  });
});
