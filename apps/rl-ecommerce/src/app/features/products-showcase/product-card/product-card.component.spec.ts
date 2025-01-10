import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardComponent } from './product-card.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductsService } from '../../products/services/products.service';
import { provideHttpClient } from '@angular/common/http';
import { ToastService } from '../../../shared/services/toast.service';
import { CartService } from '../../../shared/services/cart.service';
import { UserAccountService } from '../../user/user-account/services/user-account.service';
import { ReviewService } from '../../../shared/services/review.service';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { DialogService } from 'primeng/dynamicdialog';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [
        provideHttpClientTesting(),
        provideHttpClient(),
        ProductsService,
        ToastService,
        CartService,
        UserAccountService,
        ReviewService,
        provideRouter([]),
        provideStore(),
        DialogService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('required', 'test');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a title', () => {
    expect(component).toContain('ProductCard');
  });
});
