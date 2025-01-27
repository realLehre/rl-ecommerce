import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsComponent } from './product-details.component';
import { provideRouter } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { CartService } from '../../../shared/services/cart.service';
import { ReviewService } from '../../../shared/services/review.service';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/services/auth.service';
import { provideMockStore } from '@ngrx/store/testing';
import { IProduct } from '../model/product.interface';

fdescribe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductsService>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;

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

  beforeEach(async () => {
    productServiceSpy = jasmine.createSpyObj('ProductsService', [
      'getProducts',
    ]);
    cartServiceSpy = jasmine.createSpyObj('CartService', ['']);
    await TestBed.configureTestingModule({
      imports: [ProductDetailsComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: ProductsService, useValue: productServiceSpy },
        { provide: CartService, useValue: cartServiceSpy },
        ReviewService,
        AuthService,
        provideMockStore(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
