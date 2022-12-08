import { Component } from '@angular/core';
import { BaseInputComponent } from '../base-input/base-input.component';

@Component({
  selector: 'app-wysiwyg-input',
  templateUrl: './wysiwyg-input.component.html',
  styleUrls: ['./wysiwyg-input.component.scss'],
})
export class WysiwygInputComponent extends BaseInputComponent {}
