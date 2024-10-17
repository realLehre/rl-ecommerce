import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnsavedChangesAlertComponent } from './unsaved-changes-alert.component';

describe('UnsavedChangesAlertComponent', () => {
  let component: UnsavedChangesAlertComponent;
  let fixture: ComponentFixture<UnsavedChangesAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnsavedChangesAlertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UnsavedChangesAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
