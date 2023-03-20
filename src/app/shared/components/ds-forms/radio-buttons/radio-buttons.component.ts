import { Component, Input } from '@angular/core';
import { BaseInputComponent } from '../base-input/base-input.component';

@Component({
  selector: 'app-radio-buttons',
  templateUrl: './radio-buttons.component.html',
  styleUrls: ['./radio-buttons.component.scss'],
})
export class RadioButtonsComponent extends BaseInputComponent {
  @Input() options;
  @Input() optionsLabels;
  @Input() inactiveClasses;
  @Input() activeClasses;
  @Input() group: boolean = true;

  public buttonWidth;

  constructor() {
    super();
    this.subscriptions.add(
      this.controlInitialized.subscribe((value) => {
        if (value) {
          this.initializeControl();
        }
      })
    );
  }

  initializeControl() {
    this.inactiveClasses = this.inactiveClasses
      ? this.inactiveClasses
      : 'btn btn-outline-primary';
    this.activeClasses = this.activeClasses
      ? this.activeClasses
      : 'btn btn-primary active';
  }

  setClass(option) {
    if (this.control.value === option) {
      return this.activeClasses;
    }
    return this.inactiveClasses;
  }

  changeValue(option) {
    this.control.setValue(option);
  }
}
