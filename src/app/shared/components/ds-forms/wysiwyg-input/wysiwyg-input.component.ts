import { Component } from '@angular/core';
import { BaseInputComponent } from '../base-input/base-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorComponent } from '@tinymce/tinymce-angular';


@Component({
    selector: 'app-wysiwyg-input',
    templateUrl: './wysiwyg-input.component.html',
    styleUrls: ['./wysiwyg-input.component.scss'],
    imports: [
    EditorComponent,
    FormsModule,
    ReactiveFormsModule
]
})
export class WysiwygInputComponent extends BaseInputComponent {}
