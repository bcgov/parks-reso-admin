import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-facility-edit-form-pass-requirements',
  templateUrl: './facility-edit-form-pass-requirements.component.html',
  styleUrls: ['./facility-edit-form-pass-requirements.component.scss'],
})
export class FacilityEditFormPassRequirementsComponent implements OnInit {
  @Input() facilityPassesRequired = new UntypedFormControl();
  @Input() facilityBookingDays = new UntypedFormGroup({});
  @Input() facilityBookingTimes = new UntypedFormGroup({});
  @Input() facilityBookingDaysRichText = new UntypedFormControl();

  public facilityBookingDaysArray: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.facilityBookingDaysArray = [
      {
        id: 0,
        day: 'Sunday',
        symbol: 'Su',
        control: this.facilityBookingDays.get('Sunday'),
      },
      {
        id: 1,
        day: 'Monday',
        symbol: 'M',
        control: this.facilityBookingDays.get('Monday'),
      },
      {
        id: 2,
        day: 'Tuesday',
        symbol: 'T',
        control: this.facilityBookingDays.get('Tuesday'),
      },
      {
        id: 3,
        day: 'Wednesday',
        symbol: 'W',
        control: this.facilityBookingDays.get('Wednesday'),
      },
      {
        id: 4,
        day: 'Thursday',
        symbol: 'Th',
        control: this.facilityBookingDays.get('Thursday'),
      },
      {
        id: 5,
        day: 'Friday',
        symbol: 'F',
        control: this.facilityBookingDays.get('Friday'),
      },
      {
        id: 6,
        day: 'Saturday',
        symbol: 'Sa',
        control: this.facilityBookingDays.get('Saturday'),
      },
    ];
  }

  getControl(controlName) {
    return this.facilityBookingTimes.get(controlName) as UntypedFormControl;
  }

  togglePassesRequired(event) {
    if (!event) {
      for (const day of Object.keys(this.facilityBookingDays.controls)) {
        this.facilityBookingDays.get(day)?.setValue(true);
      }
    }
  }
}
