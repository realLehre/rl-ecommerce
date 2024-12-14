import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDeleteDialogComponent } from './product-delete-dialog.component';

describe('ProductDeleteDialogComponent', () => {
  let component: ProductDeleteDialogComponent;
  let fixture: ComponentFixture<ProductDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDeleteDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
