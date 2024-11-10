import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingReviewsComponent } from './pending-reviews.component';

describe('PendingReviewsComponent', () => {
  let component: PendingReviewsComponent;
  let fixture: ComponentFixture<PendingReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingReviewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
