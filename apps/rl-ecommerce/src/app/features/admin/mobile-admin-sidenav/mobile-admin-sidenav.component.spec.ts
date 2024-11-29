import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileAdminSidenavComponent } from './mobile-admin-sidenav.component';

describe('MobileAdminSidenavComponent', () => {
  let component: MobileAdminSidenavComponent;
  let fixture: ComponentFixture<MobileAdminSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileAdminSidenavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileAdminSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
