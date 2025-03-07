import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { FacilityEditFormPassRequirementsComponent } from './facility-edit-form-pass-requirements.component';

describe('FacilityEditFormPassRequirementsComponent', () => {
  let component: FacilityEditFormPassRequirementsComponent;
  let fixture: ComponentFixture<FacilityEditFormPassRequirementsComponent>;

  let mockfacilityPassesRequired = new UntypedFormControl(false);
  let mockFacilityBookingDays = {
    Monday: new UntypedFormControl(false),
    Tuesday: new UntypedFormControl(false),
    Wednesday: new UntypedFormControl(false),
    Thursday: new UntypedFormControl(false),
    Friday: new UntypedFormControl(false),
    Saturday: new UntypedFormControl(false),
    Sunday: new UntypedFormControl(false),
  };
  let mockfacilityBookingTimes = new UntypedFormGroup({
    AM: new UntypedFormControl(false),
    PM: new UntypedFormControl(false),
    DAY: new UntypedFormControl(false),
    capacityAM: new UntypedFormControl(0),
    capacityPM: new UntypedFormControl(0),
    capacityDAY: new UntypedFormControl(0)
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacilityEditFormPassRequirementsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      FacilityEditFormPassRequirementsComponent
    );
    component = fixture.componentInstance;
    component.facilityPassesRequired = mockfacilityPassesRequired;
    component.facilityBookingDays = mockFacilityBookingDays;
    component.facilityBookingTimes = mockfacilityBookingTimes;
    component.facilityBookingDaysRichText = new UntypedFormControl(null);
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
