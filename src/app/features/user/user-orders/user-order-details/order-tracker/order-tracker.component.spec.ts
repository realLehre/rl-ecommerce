import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTrackerComponent } from './order-tracker.component';

describe('OrderTrackerComponent', () => {
  let component: OrderTrackerComponent;
  let fixture: ComponentFixture<OrderTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
