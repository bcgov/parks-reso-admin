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
  public richTextDefault =
    '<p>You don&rsquo;t need a day-use pass for this date and pass type. Passes may be required on other days and at other parks.</p>';

  constructor() {}

  ngOnInit(): void {
    if (!this.facilityBookingDaysRichText?.value) {
      this.facilityBookingDaysRichText.setValue(this.richTextDefault);
    }
    this.facilityBookingDaysArray = [
      {
        id: 0,
        day: 'Sunday',
        symbol: 'Su',
        control: this.facilityBookingDays['Sunday'],
      },
      {
        id: 1,
        day: 'Monday',
        symbol: 'M',
        control: this.facilityBookingDays['Monday'],
      },
      {
        id: 2,
        day: 'Tuesday',
        symbol: 'T',
        control: this.facilityBookingDays['Tuesday'],
      },
      {
        id: 3,
        day: 'Wednesday',
        symbol: 'W',
        control: this.facilityBookingDays['Wednesday'],
      },
      {
        id: 4,
        day: 'Thursday',
        symbol: 'Th',
        control: this.facilityBookingDays['Thursday'],
      },
      {
        id: 5,
        day: 'Friday',
        symbol: 'F',
        control: this.facilityBookingDays['Friday'],
      },
      {
        id: 6,
        day: 'Saturday',
        symbol: 'Sa',
        control: this.facilityBookingDays['Saturday'],
      },
    ];
  }

  getControl(controlName) {
    return this.facilityBookingTimes[controlName] as UntypedFormControl;
  }

  togglePassesRequired(event) {
    if (!event) {
      for (const day of Object.keys(this.facilityBookingDays)) {
        this.facilityBookingDays[day]?.setValue(true);
      }
    }
  }
}
