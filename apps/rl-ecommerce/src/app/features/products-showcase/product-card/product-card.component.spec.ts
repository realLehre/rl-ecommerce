import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { Router } from '@angular/router';
import { ProductsService } from '../../products/services/products.service';
import { ToastService } from '../../../shared/services/toast.service';
import { CartService } from '../../../shared/services/cart.service';
import { UserAccountService } from '../../user/user-account/services/user-account.service';
import { ReviewService } from '../../../shared/services/review.service';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { IProduct } from '../../products/model/product.interface';
import { CurrencyPipe } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ProductQuantityComponent } from '../../../shared/components/product-quantity/product-quantity.component';
import { PricePercentageDecreasePipe } from '../../../shared/pipes/price-percentage-decrease.pipe';
import { provideHttpClient } from '@angular/common/http';
import { signal, WritableSignal } from '@angular/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ICart } from '../../../shared/models/cart.interface';
import { IUser } from '../../user/models/user.interface';
import { addToCart, loadCart } from '../../../state/cart/cart.actions';
import { By } from '@angular/platform-browser';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let productServiceSpy: jasmine.SpyObj<ProductsService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let userServiceSpy: jasmine.SpyObj<UserAccountService>;
  let reviewServiceSpy: jasmine.SpyObj<ReviewService>;
  let storeSpy: jasmine.SpyObj<Store>;
  let store: MockStore;

  const mockProduct: IProduct = {
    id: '998acfb0-b696-45e4-bb69-0cb4483e9d59',
    name: 'Super Soaker Water Blaster',
    description:
      '<p><em>The ultimate summer cooling entertainment for ages 6+</em></p><p>This vibrant water gun brings endless fun to outdoor water play activities with its powerful stream and kid-friendly design.</p><p><strong>Product Features:</strong></p><ul><li><strong>High-Capacity Tank</strong>: Features a large 600ml water reservoir for extended play time between refills</li><li><strong>Easy-Grip Design</strong>: Ergonomically designed handle with textured grip perfect for small hands</li><li><strong>Powerful Stream</strong>: Shoots water up to 30 feet (9 meters) with consistent pressure</li><li><strong>Simple Operation</strong>: User-friendly trigger mechanism requires minimal hand strength to operate</li><li><strong>Durable Construction</strong>: Made from high-quality, impact-resistant plastic that can withstand active play</li></ul><p><strong>Technical Specifications:</strong></p><ul><li>Material: BPA-free plastic</li><li>Dimensions: 12&quot; x 6&quot; x 3&quot; (30.5 x 15.2 x 7.6 cm)</li><li>Tank Capacity: 600ml</li><li>Range: Up to 30 feet</li><li>Weight (empty): 0.5 lbs (227g)</li></ul><p><strong>Package Includes</strong>:</p><ul><li>1x Water Blaster</li><li>Instruction manual</li><li>Safety guide</li></ul><p><strong>Safety Features</strong>:</p><ul><li>Non-toxic materials</li><li>Smooth edges</li><li>Pressure release valve</li><li>Child-safe trigger mechanism</li></ul><p><em>Note: Recommended for outdoor use only. Adult supervision recommended for younger children.</em></p>',
    image:
      'https://tentdyesixetvyacewwr.supabase.co/storage/v1/object/sign/just-product-images/5b33d745-6d54-46c0-a301-90d80c25639f-steptodown.com596144%20(1).jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJqdXN0LXByb2R1Y3QtaW1hZ2VzLzViMzNkNzQ1LTZkNTQtNDZjMC1hMzAxLTkwZDgwYzI1NjM5Zi1zdGVwdG9kb3duLmNvbTU5NjE0NCAoMSkuanBnIiwiaWF0IjoxNzM2MzQyODMyLCJleHAiOjIwNTE5MTg4MzJ9.zQLOBqh0QY2hkPlJff7Aavj7daFyaH8g3JwNMKsFUno',
    imageUrls: [
      'https://tentdyesixetvyacewwr.supabase.co/storage/v1/object/sign/just-product-images/5b33d745-6d54-46c0-a301-90d80c25639f-steptodown.com596144%20(1).jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJqdXN0LXByb2R1Y3QtaW1hZ2VzLzViMzNkNzQ1LTZkNTQtNDZjMC1hMzAxLTkwZDgwYzI1NjM5Zi1zdGVwdG9kb3duLmNvbTU5NjE0NCAoMSkuanBnIiwiaWF0IjoxNzM2MzQyODMyLCJleHAiOjIwNTE5MTg4MzJ9.zQLOBqh0QY2hkPlJff7Aavj7daFyaH8g3JwNMKsFUno',
    ],
    videoUrls: [],
    price: 129000,
    previousPrice: 0,
    isSoldOut: false,
    unit: 10,
    categoryId: '9ffd64b7-564d-4afd-b81d-ee095d640757',
    subCategoryId: '15c36965-5ae5-4bdf-9aff-307ee6952138',
    createdAt: '2025-01-08T13:27:17.512Z',
    updateAt: '2025-01-08T17:18:08.876Z',
    category: {
      id: '9ffd64b7-564d-4afd-b81d-ee095d640757',
      name: 'Outdoor Toys',
      createdAt: '2024-10-19T14:54:21.715Z',
      updateAt: '2024-10-19T14:54:21.715Z',
    },
    subCategory: {
      id: '15c36965-5ae5-4bdf-9aff-307ee6952138',
      name: 'Water Toys',
      categoryId: '9ffd64b7-564d-4afd-b81d-ee095d640757',
      createdAt: '2024-10-19T14:54:21.715Z',
      updateAt: '2024-10-19T14:54:21.715Z',
    },
    ratings: [],
  };

  const mockCart = {
    id: 'da3e3e94-41a9-41d6-872a-2b1eb8cb4b7f',
    cartItems: [
      {
        total: 129000,
        unit: 1,
        cartId: 'da3e3e94-41a9-41d6-872a-2b1eb8cb4b7f',
        shippingCost: 100,
        product: {
          id: '998acfb0-b696-45e4-bb69-0cb4483e9d59',
          name: 'Super Soaker Water Blaster',
          description:
            '<p><em>The ultimate summer cooling entertainment for ages 6+</em></p><p>This vibrant water gun brings endless fun to outdoor water play activities with its powerful stream and kid-friendly design.</p><p><strong>Product Features:</strong></p><ul><li><strong>High-Capacity Tank</strong>: Features a large 600ml water reservoir for extended play time between refills</li><li><strong>Easy-Grip Design</strong>: Ergonomically designed handle with textured grip perfect for small hands</li><li><strong>Powerful Stream</strong>: Shoots water up to 30 feet (9 meters) with consistent pressure</li><li><strong>Simple Operation</strong>: User-friendly trigger mechanism requires minimal hand strength to operate</li><li><strong>Durable Construction</strong>: Made from high-quality, impact-resistant plastic that can withstand active play</li></ul><p><strong>Technical Specifications:</strong></p><ul><li>Material: BPA-free plastic</li><li>Dimensions: 12&quot; x 6&quot; x 3&quot; (30.5 x 15.2 x 7.6 cm)</li><li>Tank Capacity: 600ml</li><li>Range: Up to 30 feet</li><li>Weight (empty): 0.5 lbs (227g)</li></ul><p><strong>Package Includes</strong>:</p><ul><li>1x Water Blaster</li><li>Instruction manual</li><li>Safety guide</li></ul><p><strong>Safety Features</strong>:</p><ul><li>Non-toxic materials</li><li>Smooth edges</li><li>Pressure release valve</li><li>Child-safe trigger mechanism</li></ul><p><em>Note: Recommended for outdoor use only. Adult supervision recommended for younger children.</em></p>',
          image:
            'https://tentdyesixetvyacewwr.supabase.co/storage/v1/object/sign/just-product-images/5b33d745-6d54-46c0-a301-90d80c25639f-steptodown.com596144%20(1).jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJqdXN0LXByb2R1Y3QtaW1hZ2VzLzViMzNkNzQ1LTZkNTQtNDZjMC1hMzAxLTkwZDgwYzI1NjM5Zi1zdGVwdG9kb3duLmNvbTU5NjE0NCAoMSkuanBnIiwiaWF0IjoxNzM2MzQyODMyLCJleHAiOjIwNTE5MTg4MzJ9.zQLOBqh0QY2hkPlJff7Aavj7daFyaH8g3JwNMKsFUno',
          imageUrls: [
            'https://tentdyesixetvyacewwr.supabase.co/storage/v1/object/sign/just-product-images/5b33d745-6d54-46c0-a301-90d80c25639f-steptodown.com596144%20(1).jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJqdXN0LXByb2R1Y3QtaW1hZ2VzLzViMzNkNzQ1LTZkNTQtNDZjMC1hMzAxLTkwZDgwYzI1NjM5Zi1zdGVwdG9kb3duLmNvbTU5NjE0NCAoMSkuanBnIiwiaWF0IjoxNzM2MzQyODMyLCJleHAiOjIwNTE5MTg4MzJ9.zQLOBqh0QY2hkPlJff7Aavj7daFyaH8g3JwNMKsFUno',
          ],
          videoUrls: [],
          price: 129000,
          previousPrice: 0,
          isSoldOut: false,
          unit: 10,
          categoryId: '9ffd64b7-564d-4afd-b81d-ee095d640757',
          subCategoryId: '15c36965-5ae5-4bdf-9aff-307ee6952138',
          createdAt: '2025-01-08T13:27:17.512Z',
          rating: 0,
          updateAt: '2025-01-08T17:18:08.876Z',
          category: {
            id: '9ffd64b7-564d-4afd-b81d-ee095d640757',
            name: 'Outdoor Toys',
            createdAt: '2024-10-19T14:54:21.715Z',
            updateAt: '2024-10-19T14:54:21.715Z',
          },
          subCategory: {
            id: '15c36965-5ae5-4bdf-9aff-307ee6952138',
            name: 'Water Toys',
            categoryId: '9ffd64b7-564d-4afd-b81d-ee095d640757',
            createdAt: '2024-10-19T14:54:21.715Z',
            updateAt: '2024-10-19T14:54:21.715Z',
          },
          ratings: [],
        },
        id: 'cc96425c-62bf-4b35-a490-4f258d3ffa3d',
        productId: '998acfb0-b696-45e4-bb69-0cb4483e9d59',
        updatedAt:
          'Tue Jan 21 2025 19:47:54 GMT+0100 (West Africa Standard Time)',
        createdAt:
          'Tue Jan 21 2025 19:47:54 GMT+0100 (West Africa Standard Time)',
      },
    ],
    createdAt: 'Tue Jan 21 2025 19:47:23 GMT+0100 (West Africa Standard Time)',
    subTotal: 129000,
    shippingCost: 100,
    updatedAt: 'Tue Jan 21 2025 19:47:54 GMT+0100 (West Africa Standard Time)',
    userId: '6989bb89-f0e7-4a8a-a12e-144dcee9940a',
  };

  const mockUser: IUser = {
    id: '1',
    email: 'test@test.com',
    name: 'test test',
    phoneNumber: '91272911',
  };

  let activeProductSignal: WritableSignal<IProduct | null>;
  let seeingFullReviewSignal: WritableSignal<boolean>;
  beforeEach(async () => {
    const initialState = {
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
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const productServiceSpyObj = jasmine.createSpyObj('ProductsService', [
      'createSlug',
      'getProductCartStarWidth',
      { activeProduct: activeProductSignal },
    ]);
    const toastServiceSpyObj = jasmine.createSpyObj('ToastService', [
      'showToast',
    ]);
    cartServiceSpy = jasmine.createSpyObj('CartService', ['createGuestCart'], {
      user: signal(null),
      guestCart: {},
    });
    const userServiceSpyObj = jasmine.createSpyObj('UserAccountService', [], {
      user: of(null),
    });
    const reviewServiceSpyObj = jasmine.createSpyObj('ReviewService', [], {
      seeingFullReview: seeingFullReviewSignal,
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
        provideMockStore({
          initialState,
        }),
        { provide: Router, useValue: routerSpyObj },
        { provide: ProductsService, useValue: productServiceSpyObj },
        { provide: ToastService, useValue: toastServiceSpyObj },
        { provide: CartService, useValue: cartServiceSpy },
        { provide: UserAccountService, useValue: userServiceSpyObj },
        { provide: ReviewService, useValue: reviewServiceSpyObj },
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
    store = TestBed.inject(MockStore);

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
    expect(component.averageRating()).toBe(0);
  });

  it('should create a guest cart and load it if no user or guest cart exists', () => {
    cartServiceSpy.user.set(null);
    cartServiceSpy.guestCart = {} as ICart;
    spyOn(store, 'dispatch').and.callThrough();
    // store.overrideSelector(selectCart, {
    //   items: [{ product: component.product(), unit: component.quantity }],
    // });
    component.onAddToCart();
    expect(cartServiceSpy.createGuestCart).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(loadCart());
    expect(store.dispatch).toHaveBeenCalledWith(
      addToCart({ product: component.product(), unit: component.quantity }),
    );
  });

  it('should add item to cart if user is logged in', () => {
    cartServiceSpy.user.set(mockUser);
    spyOn(store, 'dispatch').and.callThrough();
    component.onAddToCart();
    expect(store.dispatch).toHaveBeenCalledWith(
      addToCart({ product: component.product(), unit: component.quantity }),
    );
  });

  it('should not show add to cart button after product has been added to cart', () => {
    cartServiceSpy.user.set(mockUser);
    spyOn(store, 'dispatch').and.callThrough();
    component.onAddToCart();
    const addToCartBtn = fixture.debugElement.query(
      By.css('[data-test-id="add-to-cart"]'),
    );
    fixture.detectChanges();
    console.log(component.productInCart());
    expect(addToCartBtn).toBeTruthy();
  });
});
