import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkFormComponent } from './park-form.component';

describe('ParkFormComponent', () => {
  let component: ParkFormComponent;
  let fixture: ComponentFixture<ParkFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParkFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
