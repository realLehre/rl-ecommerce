import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOptionsComponent } from './payment-options.component';

describe('PaymentOptionsComponent', () => {
  let component: PaymentOptionsComponent;
  let fixture: ComponentFixture<PaymentOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
