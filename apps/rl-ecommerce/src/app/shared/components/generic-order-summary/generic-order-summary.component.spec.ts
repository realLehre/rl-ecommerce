import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericOrderSummaryComponent } from './generic-order-summary.component';

describe('GenericOrderSummaryComponent', () => {
  let component: GenericOrderSummaryComponent;
  let fixture: ComponentFixture<GenericOrderSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericOrderSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GenericOrderSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
