import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-picklist',
  templateUrl: './picklist.component.html',
  styleUrls: ['./picklist.component.scss'],
})
export class PicklistComponent {
  @Input() control = new UntypedFormControl();
  @Input() selectOptions;
  @Input() label;
  @Input() icon;
  @Input() id;
  @Input() ariaLabel;
  @Input() ariaDescribedBy;

  @ViewChild('toggleDropdown') toggleDropdown: ElementRef;

  constructor() {}
}
