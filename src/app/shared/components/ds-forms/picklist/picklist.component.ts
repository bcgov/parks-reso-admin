import { Component, Input } from '@angular/core';
import { BaseInputComponent } from '../base-input/base-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgClass, NgFor } from '@angular/common';

@Component({
    selector: 'app-picklist',
    templateUrl: './picklist.component.html',
    styleUrls: ['./picklist.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        NgClass,
        FormsModule,
        ReactiveFormsModule,
        NgFor,
    ],
})
export class PicklistComponent extends BaseInputComponent {
  @Input() selectOptions;
  @Input() defaultNullDisplay;

  drawStrikeoutBar() {
    return ('─').repeat(25);
  }
}