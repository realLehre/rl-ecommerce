import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrderCustomerInfoComponent } from './admin-order-customer-info.component';

describe('AdminOrderCustomerInfoComponent', () => {
  let component: AdminOrderCustomerInfoComponent;
  let fixture: ComponentFixture<AdminOrderCustomerInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminOrderCustomerInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminOrderCustomerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
