import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { TextInputComponent } from '../../../../shared/components/ds-forms/text-input/text-input.component';
import { ToggleComponent } from '../../../../shared/components/ds-forms/toggle/toggle.component';

@Component({
    selector: 'app-facility-edit-form-publishing-details',
    templateUrl: './facility-edit-form-publishing-details.component.html',
    styleUrls: ['./facility-edit-form-publishing-details.component.scss'],
    imports: [ToggleComponent, TextInputComponent]
})
export class FacilityEditFormPublishingDetailsComponent implements OnInit {
  @Input() facilityStatus = new UntypedFormControl();
  @Input() facilityClosureReason = new UntypedFormControl();
  @Input() facilityVisibility = new UntypedFormControl();
  @Input() facilityQRCode = new UntypedFormControl(); 

  constructor() { }

  ngOnInit(): void {
  }

}
