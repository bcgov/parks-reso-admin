import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityEditComponent } from './facility-edit.component';

describe('FacilityEditComponent', () => {
  let component: FacilityEditComponent;
  let fixture: ComponentFixture<FacilityEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FacilityEditComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
