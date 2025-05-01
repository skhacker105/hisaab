import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsDetailsDialogComponent } from './sms-details-dialog.component';

describe('SmsDetailsDialogComponent', () => {
  let component: SmsDetailsDialogComponent;
  let fixture: ComponentFixture<SmsDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SmsDetailsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SmsDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
