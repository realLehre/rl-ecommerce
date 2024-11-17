import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPendingOrdersComponent } from './admin-pending-orders.component';

describe('AdminPendingOrdersComponent', () => {
  let component: AdminPendingOrdersComponent;
  let fixture: ComponentFixture<AdminPendingOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPendingOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPendingOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
