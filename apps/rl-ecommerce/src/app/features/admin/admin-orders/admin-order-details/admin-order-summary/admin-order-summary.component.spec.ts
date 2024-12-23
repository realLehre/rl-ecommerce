import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrderSummaryComponent } from './admin-order-summary.component';

describe('AdminOrderSummaryComponent', () => {
  let component: AdminOrderSummaryComponent;
  let fixture: ComponentFixture<AdminOrderSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminOrderSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminOrderSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
