import { Component, Input } from '@angular/core';
import { BaseInputComponent } from '../base-input/base-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgClass } from '@angular/common';

@Component({
    selector: 'app-text-area',
    templateUrl: './text-area.component.html',
    styleUrls: ['./text-area.component.scss'],
    imports: [
        NgIf,
        NgClass,
        FormsModule,
        ReactiveFormsModule,
    ]
})
export class TextAreaComponent extends BaseInputComponent {
  @Input() charCap;

  getFieldLength() {
    let value: string = '';
    if (this.control) {
      value = this.control?.value || '';
    }
    return value.length;
  }

  onInput(event) {
    if (this.charCap && this.getFieldLength() >= this.charCap) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
