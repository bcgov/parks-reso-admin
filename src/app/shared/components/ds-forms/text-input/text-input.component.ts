import { Component, Input } from '@angular/core';
import { BaseInputComponent } from '../base-input/base-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgClass } from '@angular/common';

@Component({
    selector: 'app-text-input',
    templateUrl: './text-input.component.html',
    styleUrls: ['./text-input.component.scss'],
    imports: [
        NgIf,
        NgClass,
        FormsModule,
        ReactiveFormsModule,
    ]
})
export class TextInputComponent extends BaseInputComponent {
  @Input() type = 'text'; // text, number
  @Input() moneyMode = false;

  blockInvalidChars(e) {
    if (e.key === 'e' || e.key === 'E') {
      e.preventDefault();
    }
  }
}
