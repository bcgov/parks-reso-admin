import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParksFeatureEditComponent } from './parks-feature-edit.component';

describe('ParksFeatureEditComponent', () => {
  let component: ParksFeatureEditComponent;
  let fixture: ComponentFixture<ParksFeatureEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParksFeatureEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParksFeatureEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
