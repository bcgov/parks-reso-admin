import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkEditButtonComponent } from './park-edit-button.component';

describe('ParkEditButtonComponent', () => {
  let component: ParkEditButtonComponent;
  let fixture: ComponentFixture<ParkEditButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParkEditButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkEditButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
