import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { TimepickerComponent } from '../../../../shared/components/ds-forms/timepicker/timepicker.component';
import { PicklistComponent } from '../../../../shared/components/ds-forms/picklist/picklist.component';
import { TextInputComponent } from '../../../../shared/components/ds-forms/text-input/text-input.component';

@Component({
    selector: 'app-facility-edit-form-details',
    templateUrl: './facility-edit-form-details.component.html',
    styleUrls: ['./facility-edit-form-details.component.scss'],
    standalone: true,
    imports: [TextInputComponent, PicklistComponent, TimepickerComponent]
})
export class FacilityEditFormDetailsComponent implements OnInit {
  @Input() resetEvent = new EventEmitter();
  @Input() facilityName = new UntypedFormControl();
  @Input() facilityType = new UntypedFormControl();
  @Input() facilityBookingOpeningHour = new UntypedFormControl();
  @Input() facilityBookingDaysAhead = new UntypedFormControl();

  public facilityTypesList = [
    { value: 'Parking', display: 'Parking' },
    { value: 'Trail', display: 'Trail' },
  ];
  public bookingDaysAheadList = [
    { value: 0, display: 'Same day only' },
    { value: 1, display: '1 day in advance' },
    { value: 2, display: '2 days in advance' },
    { value: 3, display: '3 days in advance' },
    { value: 4, display: '4 days in advance' },
    { value: 5, display: '5 days in advance' }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
