import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductImagesComponent } from './admin-product-images.component';

describe('AdminProductImagesComponent', () => {
  let component: AdminProductImagesComponent;
  let fixture: ComponentFixture<AdminProductImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProductImagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProductImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
