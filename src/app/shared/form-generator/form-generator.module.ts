import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteMultiSelectModule } from '../components/autocomplete-multi-select/autocomplete-multi-select.module';
import { DatePickerModule } from '../components/date-picker/date-picker.module';
import { FormGeneratorComponent } from './form-generator.component';

@NgModule({
  imports: [DatePickerModule, FormsModule, ReactiveFormsModule, CommonModule, AutoCompleteMultiSelectModule],
  declarations: [FormGeneratorComponent],
  entryComponents: [],
  exports: [FormGeneratorComponent],
  providers: []
})
export class FormGeneratorModule {}
