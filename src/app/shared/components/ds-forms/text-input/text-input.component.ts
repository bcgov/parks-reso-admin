import { Component, Input} from '@angular/core';
import { BaseInputComponent } from '../base-input/base-input.component';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
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
