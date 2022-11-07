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
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    NgSelectModule,
    TimepickerModule,
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
  ],
})
export class DsFormsModule {}
