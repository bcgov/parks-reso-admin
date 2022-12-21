import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { FacilityEditFormPassRequirementsComponent } from './facility-edit-form-pass-requirements.component';

describe('FacilityEditFormPassRequirementsComponent', () => {
  let component: FacilityEditFormPassRequirementsComponent;
  let fixture: ComponentFixture<FacilityEditFormPassRequirementsComponent>;

  let mockFacilityBookingDays = {
    Monday: new UntypedFormControl(false),
    Tuesday: new UntypedFormControl(false),
    Wednesday: new UntypedFormControl(false),
    Thursday: new UntypedFormControl(false),
    Friday: new UntypedFormControl(false),
    Saturday: new UntypedFormControl(false),
    Sunday: new UntypedFormControl(false),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FacilityEditFormPassRequirementsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      FacilityEditFormPassRequirementsComponent
    );
    component = fixture.componentInstance;
    component.facilityBookingDays = mockFacilityBookingDays;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('toggles whether passes required', async () => {
    component.togglePassesRequired(false);
    for (const day of Object.keys(component.facilityBookingDays)) {
      console.log('day:', day);
      console.log('component.facilityBookingDays.controls[day].value:', component.facilityBookingDays[day].value);
      expect(component.facilityBookingDays[day]?.value).toBeTrue();
    }
  });
});
