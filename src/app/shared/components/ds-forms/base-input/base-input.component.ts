import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-base-input',
  templateUrl: './base-input.component.html',
  styleUrls: ['./base-input.component.scss'],
})
export class BaseInputComponent {
  @Input() control = new UntypedFormControl();
  @Input() label;
  @Input() icon;
  @Input() placeholder;
  @Input() id;
  @Input() ariaLabel;
  @Input() ariaDescribedBy;

  @Output() inputChange = new EventEmitter<any>();

  constructor() {}

  isRequired() {
    if (this.control.hasValidator(Validators.required)) {
      return true;
    }
    return false;
  }

  isInvalid() {
    if (this.control.invalid && this.control.touched) {
      return true;
    }
    return false;
  }

  onChange(event) {
    this.inputChange.emit(event);
  }
}
