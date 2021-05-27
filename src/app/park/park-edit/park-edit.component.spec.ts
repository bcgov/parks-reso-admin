import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkEditComponent } from './park-edit.component';

describe('ParkEditComponent', () => {
  let component: ParkEditComponent;
  let fixture: ComponentFixture<ParkEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParkEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
