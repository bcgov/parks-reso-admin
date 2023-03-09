import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseFormComponent } from './base-form/base-form.component';
import { PicklistComponent } from './picklist/picklist.component';
import { TextAreaComponent } from './text-area/text-area.component';
import { TextInputComponent } from './text-input/text-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShortdatePickerComponent } from './shortdate-picker/shortdate-picker.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MultiselectComponent } from './multiselect/multiselect.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToggleComponent } from './toggle/toggle.component';
import { TimepickerComponent } from './timepicker/timepicker.component';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { BaseInputComponent } from './base-input/base-input.component';
import { WysiwygInputComponent } from './wysiwyg-input/wysiwyg-input.component';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { RadioButtonsComponent } from './radio-buttons/radio-buttons.component';

@NgModule({
  declarations: [
    BaseFormComponent,
    PicklistComponent,
    TextAreaComponent,
    TextInputComponent,
    ShortdatePickerComponent,
    MultiselectComponent,
    ToggleComponent,
    TimepickerComponent,
    CheckboxComponent,
    BaseInputComponent,
    WysiwygInputComponent,
    RadioButtonsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    NgSelectModule,
    TimepickerModule,
    EditorModule,
  ],
  exports: [
    BaseFormComponent,
    PicklistComponent,
    TextAreaComponent,
    TextInputComponent,
    ShortdatePickerComponent,
    MultiselectComponent,
    ToggleComponent,
    TimepickerComponent,
    CheckboxComponent,
    WysiwygInputComponent,
    RadioButtonsComponent
  ],
})
export class DsFormsModule {}
