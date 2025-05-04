import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionSelectorDialogComponent } from './division-selector-dialog.component';

describe('DivisionSelectorDialogComponent', () => {
  let component: DivisionSelectorDialogComponent;
  let fixture: ComponentFixture<DivisionSelectorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DivisionSelectorDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DivisionSelectorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
