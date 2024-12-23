import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrderStatusComponent } from './admin-order-status.component';

describe('AdminOrderStatusComponent', () => {
  let component: AdminOrderStatusComponent;
  let fixture: ComponentFixture<AdminOrderStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminOrderStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminOrderStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
