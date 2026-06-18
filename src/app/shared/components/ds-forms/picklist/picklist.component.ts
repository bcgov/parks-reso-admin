import { Component, Input } from '@angular/core';
import { BaseInputComponent } from '../base-input/base-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-picklist',
    templateUrl: './picklist.component.html',
    styleUrls: ['./picklist.component.scss'],
    imports: [
    NgClass,
    FormsModule,
    ReactiveFormsModule
]
})
export class PicklistComponent extends BaseInputComponent {
  @Input() selectOptions;
  @Input() defaultNullDisplay;

  drawStrikeoutBar() {
    return ('─').repeat(25);
  }
}