import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityEditFormDetailsComponent } from './facility-edit-form-details.component';

describe('FacilityEditFormDetailsComponent', () => {
  let component: FacilityEditFormDetailsComponent;
  let fixture: ComponentFixture<FacilityEditFormDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacilityEditFormDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacilityEditFormDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
