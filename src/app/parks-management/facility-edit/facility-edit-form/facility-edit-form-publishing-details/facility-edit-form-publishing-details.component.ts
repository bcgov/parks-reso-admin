import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-facility-edit-form-publishing-details',
  templateUrl: './facility-edit-form-publishing-details.component.html',
  styleUrls: ['./facility-edit-form-publishing-details.component.scss']
})
export class FacilityEditFormPublishingDetailsComponent implements OnInit {
  @Input() facilityStatus = new UntypedFormControl();
  @Input() facilityClosureReason = new UntypedFormControl();
  @Input() facilityVisibility = new UntypedFormControl();

  constructor() { }

  ngOnInit(): void {
  }

}
