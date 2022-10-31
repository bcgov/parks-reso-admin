import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-passes-filter-fields',
  templateUrl: './passes-filter-fields.component.html',
  styleUrls: ['./passes-filter-fields.component.scss']
})
export class PassesFilterFieldsComponent implements OnChanges {
  @Input() passType = new UntypedFormControl;
  @Input() passTypeOptions;
  @Input() passDate = new UntypedFormControl;
  @Input() passStatus = new UntypedFormControl;
  @Input() passStatusOptions;
  @Input() passFirstName = new UntypedFormControl;
  @Input() passLastName = new UntypedFormControl;
  @Input() passEmail = new UntypedFormControl;
  @Input() passReservationNumber = new UntypedFormControl;

  constructor() { }

  ngOnChanges(): void {
  }

}
