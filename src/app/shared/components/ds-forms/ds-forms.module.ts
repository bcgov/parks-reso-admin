import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseFormComponent } from './base-form/base-form.component';
import { CalculationDisplayComponent } from './calculation-display/calculation-display.component';
import { PicklistComponent } from './picklist/picklist.component';
import { TextAreaComponent } from './text-area/text-area.component';
import { TextInputComponent } from './text-input/text-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShortdatePickerComponent } from './shortdate-picker/shortdate-picker.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MultiselectComponent } from './multiselect/multiselect.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    BaseFormComponent,
    CalculationDisplayComponent,
    PicklistComponent,
    TextAreaComponent,
    TextInputComponent,
    ShortdatePickerComponent,
    MultiselectComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    BrowserAnimationsModule,
    NgSelectModule
  ],
  exports: [
    BaseFormComponent,
    CalculationDisplayComponent,
    PicklistComponent,
    TextAreaComponent,
    TextInputComponent,
    ShortdatePickerComponent,
    MultiselectComponent
  ],
})
export class DsFormsModule {}
