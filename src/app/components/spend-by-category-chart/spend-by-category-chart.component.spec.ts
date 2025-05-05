import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendByCategoryChartComponent } from './spend-by-category-chart.component';

describe('SpendByCategoryChartComponent', () => {
  let component: SpendByCategoryChartComponent;
  let fixture: ComponentFixture<SpendByCategoryChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpendByCategoryChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpendByCategoryChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
