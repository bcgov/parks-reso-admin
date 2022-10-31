import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-multiselect',
  templateUrl: './multiselect.component.html',
  styleUrls: ['./multiselect.component.scss'],
  // Note: ViewEncapsulation necessary to override ng-select css classes.
  encapsulation: ViewEncapsulation.None,
})
export class MultiselectComponent implements OnInit {
  @Input() control = new UntypedFormControl();
  @Input() multiSelectOptions;
  @Input() label;
  @Input() icon;
  @Input() id;
  @Input() ariaLabel;
  @Input() ariaDescribedBy;
  @Input() placeholder;

  public selectedOptions: any[] = [];
  public isDisabled;

  constructor() {}

  ngOnInit(): void {
    if (!this.control.value) {
      this.control.setValue(this.selectedOptions);
    }
  }

  checkDisabled(){
    return this.control.disabled || false;
  }

  updateMultiselect() {
    this.control.setValue(this.selectedOptions);
  }
}
