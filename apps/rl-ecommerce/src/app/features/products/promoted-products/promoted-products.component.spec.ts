import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotedProductsComponent } from './promoted-products.component';

describe('PromotedProductsComponent', () => {
  let component: PromotedProductsComponent;
  let fixture: ComponentFixture<PromotedProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotedProductsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PromotedProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
