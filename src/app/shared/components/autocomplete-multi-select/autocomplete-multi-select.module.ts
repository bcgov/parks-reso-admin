import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AutoCompleteMultiSelectComponent } from './autocomplete-multi-select.component';

@NgModule({
  declarations: [AutoCompleteMultiSelectComponent],
  imports: [NgSelectModule, FormsModule, CommonModule],
  entryComponents: [],
  exports: [AutoCompleteMultiSelectComponent],
  providers: []
})
export class AutoCompleteMultiSelectModule {}
