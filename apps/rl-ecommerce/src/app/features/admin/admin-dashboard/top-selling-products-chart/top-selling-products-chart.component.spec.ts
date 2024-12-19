import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopSellingProductsChartComponent } from './top-selling-products-chart.component';

describe('TopSellingProductsChartComponent', () => {
  let component: TopSellingProductsChartComponent;
  let fixture: ComponentFixture<TopSellingProductsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopSellingProductsChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopSellingProductsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
