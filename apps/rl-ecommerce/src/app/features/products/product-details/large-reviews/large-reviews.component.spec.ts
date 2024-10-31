import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LargeReviewsComponent } from './large-reviews.component';

describe('LargeReviewsComponent', () => {
  let component: LargeReviewsComponent;
  let fixture: ComponentFixture<LargeReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LargeReviewsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LargeReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
