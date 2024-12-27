import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCategoryDetailsComponent } from './admin-category-details.component';

describe('AdminCategoryDetailsComponent', () => {
  let component: AdminCategoryDetailsComponent;
  let fixture: ComponentFixture<AdminCategoryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCategoryDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCategoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
