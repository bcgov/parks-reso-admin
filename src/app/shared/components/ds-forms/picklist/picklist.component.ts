import { Component, Input } from '@angular/core';
import { BaseInputComponent } from '../base-input/base-input.component';

@Component({
  selector: 'app-picklist',
  templateUrl: './picklist.component.html',
  styleUrls: ['./picklist.component.scss'],
})
export class PicklistComponent extends BaseInputComponent {
  @Input() selectOptions;
  @Input() defaultNullDisplay;

  drawStrikeoutBar() {
    return ('─').repeat(25);
  }
}