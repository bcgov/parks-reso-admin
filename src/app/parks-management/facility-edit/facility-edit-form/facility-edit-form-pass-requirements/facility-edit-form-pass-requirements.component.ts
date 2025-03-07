import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Constants } from 'src/app/shared/utils/constants';
import { TextInputComponent } from '../../../../shared/components/ds-forms/text-input/text-input.component';
import { WysiwygInputComponent } from '../../../../shared/components/ds-forms/wysiwyg-input/wysiwyg-input.component';
import { CheckboxComponent } from '../../../../shared/components/ds-forms/checkbox/checkbox.component';
import { NgIf, NgFor } from '@angular/common';
import { ToggleComponent } from '../../../../shared/components/ds-forms/toggle/toggle.component';

@Component({
    selector: 'app-facility-edit-form-pass-requirements',
    templateUrl: './facility-edit-form-pass-requirements.component.html',
    styleUrls: ['./facility-edit-form-pass-requirements.component.scss'],
    imports: [
        ToggleComponent,
        NgIf,
        NgFor,
        CheckboxComponent,
        WysiwygInputComponent,
        TextInputComponent,
    ]
})
export class FacilityEditFormPassRequirementsComponent implements OnInit {
  @Input() facilityPassesRequired = new UntypedFormControl();
  @Input() facilityBookingDays = {};
  @Input() facilityBookingTimes = new UntypedFormGroup({});
  @Input() facilityBookingDaysRichText = new UntypedFormControl();

  public facilityBookingDaysArray: any[] = [];
  public richTextDefault =
    '<p>You don&rsquo;t need a day-use pass for this date and pass type. Passes may be required on other days and at other parks.</p>';

  constructor() { }

  ngOnInit(): void {
    if (!this.facilityBookingDaysRichText?.value) {
      this.facilityBookingDaysRichText.setValue(this.richTextDefault);
    }
    for (const day of Constants.Weekdays) {
      const control = {
        control: this.facilityBookingDays[day.name],
      };
      const dayObj = Object.assign(day, control);
      this.facilityBookingDaysArray.push(dayObj);
    }
  }

  getControl(controlName) {
    if (this.facilityBookingTimes[controlName]) {
      return this.facilityBookingTimes[controlName] as UntypedFormControl;
    } else {
      return new UntypedFormControl(null);
    }
  }

  togglePassesRequired(event) {
    if (!event) {
      for (const day of Object.keys(this.facilityBookingDays)) {
        this.facilityBookingDays[day]?.setValue(true);
      }
    }
  }
}
