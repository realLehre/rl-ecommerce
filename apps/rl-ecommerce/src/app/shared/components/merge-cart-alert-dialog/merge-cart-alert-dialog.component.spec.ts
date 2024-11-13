import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeCartAlertDialogComponent } from './merge-cart-alert-dialog.component';

describe('MergeCartAlertDialogComponent', () => {
  let component: MergeCartAlertDialogComponent;
  let fixture: ComponentFixture<MergeCartAlertDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MergeCartAlertDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MergeCartAlertDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
