import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdWebHomePageComponent } from './prod-web-home-page.component';

describe('ProdWebHomePageComponent', () => {
  let component: ProdWebHomePageComponent;
  let fixture: ComponentFixture<ProdWebHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProdWebHomePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProdWebHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
