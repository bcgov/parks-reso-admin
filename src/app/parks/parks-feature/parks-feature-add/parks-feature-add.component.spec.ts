import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParksFeatureAddComponent } from './parks-feature-add.component';

describe('ParksFeatureAddComponent', () => {
  let component: ParksFeatureAddComponent;
  let fixture: ComponentFixture<ParksFeatureAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParksFeatureAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParksFeatureAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
