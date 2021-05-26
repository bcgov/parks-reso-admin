import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParksFeatureComponent } from './parks-feature.component';

describe('ParksFeatureComponent', () => {
  let component: ParksFeatureComponent;
  let fixture: ComponentFixture<ParksFeatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParksFeatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParksFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
