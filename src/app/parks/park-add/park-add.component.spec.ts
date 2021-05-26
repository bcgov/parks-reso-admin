import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkAddComponent } from './park-add.component';

describe('ParkAddComponent', () => {
  let component: ParkAddComponent;
  let fixture: ComponentFixture<ParkAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParkAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
