import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsImagesComponent } from './product-details-images.component';

describe('ProductDetailsImagesComponent', () => {
  let component: ProductDetailsImagesComponent;
  let fixture: ComponentFixture<ProductDetailsImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailsImagesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailsImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
