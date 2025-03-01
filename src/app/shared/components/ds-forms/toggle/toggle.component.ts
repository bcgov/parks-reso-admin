import { Component, Input } from '@angular/core';
import { BaseInputComponent } from '../base-input/base-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgClass } from '@angular/common';

@Component({
    selector: 'app-toggle',
    templateUrl: './toggle.component.html',
    styleUrls: ['./toggle.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        NgClass,
        FormsModule,
        ReactiveFormsModule,
    ],
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
