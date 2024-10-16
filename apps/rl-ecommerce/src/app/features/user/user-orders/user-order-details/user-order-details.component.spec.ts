import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOrderDetailsComponent } from './user-order-details.component';

describe('UserOrderDetailsComponent', () => {
  let component: UserOrderDetailsComponent;
  let fixture: ComponentFixture<UserOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserOrderDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
