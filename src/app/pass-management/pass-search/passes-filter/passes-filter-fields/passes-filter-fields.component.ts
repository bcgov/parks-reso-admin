import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-passes-filter-fields',
  templateUrl: './passes-filter-fields.component.html',
  styleUrls: ['./passes-filter-fields.component.scss'],
})
export class PassesFilterFieldsComponent implements OnChanges {
  @Input() passType = new UntypedFormControl();
  @Input() passTypeOptions;
  @Input() park = new UntypedFormControl();
  @Input() parkOptions;
  @Input() facility = new UntypedFormControl();
  @Input() facilityOptions;
  @Input() date = new UntypedFormControl();
  @Input() passStatus = new UntypedFormControl();
  @Input() passStatusOptions;
  @Input() firstName = new UntypedFormControl();
  @Input() lastName = new UntypedFormControl();
  @Input() email = new UntypedFormControl();
  @Input() reservationNumber = new UntypedFormControl();
  @Input() overbooked = new UntypedFormControl();
  @Input() overbookedOptions;

  constructor() { }

  ngOnChanges(): void { }
}
