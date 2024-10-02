import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductQuantityComponent } from './product-quantity.component';

describe('ProductQuantityComponent', () => {
  let component: ProductQuantityComponent;
  let fixture: ComponentFixture<ProductQuantityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductQuantityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
