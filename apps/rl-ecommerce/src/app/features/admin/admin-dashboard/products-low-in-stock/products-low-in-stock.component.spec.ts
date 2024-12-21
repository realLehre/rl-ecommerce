import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsLowInStockComponent } from './products-low-in-stock.component';

describe('ProductsLowInStockComponent', () => {
  let component: ProductsLowInStockComponent;
  let fixture: ComponentFixture<ProductsLowInStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsLowInStockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsLowInStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
