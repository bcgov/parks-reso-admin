import { Component } from '@angular/core';
import { BaseInputComponent } from '../base-input/base-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgClass } from '@angular/common';

@Component({
    selector: 'app-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss'],
    imports: [
        NgIf,
        NgClass,
        FormsModule,
        ReactiveFormsModule,
    ]
})
export class CheckboxComponent extends BaseInputComponent {}
