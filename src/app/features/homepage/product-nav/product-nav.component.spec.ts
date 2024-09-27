import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductNavComponent } from './product-nav.component';

describe('ProductNavComponent', () => {
  let component: ProductNavComponent;
  let fixture: ComponentFixture<ProductNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
