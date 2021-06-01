import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PassesComponent } from './passes.component';

describe('PassesComponent', () => {
  let component: PassesComponent;
  let fixture: ComponentFixture<PassesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
