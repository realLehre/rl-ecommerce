import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrderTrackingEventsComponent } from './admin-order-tracking-events.component';

describe('AdminOrderTrackingEventsComponent', () => {
  let component: AdminOrderTrackingEventsComponent;
  let fixture: ComponentFixture<AdminOrderTrackingEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminOrderTrackingEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminOrderTrackingEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
