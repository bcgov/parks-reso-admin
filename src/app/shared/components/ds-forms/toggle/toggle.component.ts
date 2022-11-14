import { Component, Input } from '@angular/core';
import { BaseInputComponent } from '../base-input/base-input.component';

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
})
export class ToggleComponent extends BaseInputComponent {
  @Input() description = '';
  @Input() trueText = '';
  @Input() falseText = '';

  public state;

  getSwitchState() {
    if (this.control?.value) {
      return true;
    }
    return false;
  }
}
