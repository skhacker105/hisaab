import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TentativeTransactionsComponent } from './tentative-transactions.component';

describe('TentativeTransactionsComponent', () => {
  let component: TentativeTransactionsComponent;
  let fixture: ComponentFixture<TentativeTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TentativeTransactionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TentativeTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
