import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSlideToggleModule, MatMenuModule, MatSelectModule, MatTooltipModule, MatCheckboxModule } from '@angular/material';
import { MatSnackBarModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';

import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <== add the imports!
import { RouterModule } from '@angular/router';
import { TableTemplateComponent } from './components/table-template/table-template.component';
import { TableRowDirective } from './components/table-template/table-row.directive';
import { PageSizePickerComponent } from './components/page-size-picker/page-size-picker.component';
import { PageCountDisplayComponent } from './components/page-count-display/page-count-display.component';
import { AutoCompleteMultiSelectComponent } from './components/autocomplete-multi-select/autocomplete-multi-select.component';
import { TableTemplate } from './components/table-template/table-template';
import { Utils } from './utils/utils';
import { SearchFilterTemplateComponent } from './components/search-filter-template/search-filter-template.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [
    RouterModule,
    BrowserModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    NgbModule,
    NgxPaginationModule,
    NgSelectModule,
    MatSelectModule,
    MatTooltipModule,
    MatCheckboxModule
  ],
  declarations: [
    TableRowDirective,
    TableTemplateComponent,
    PageSizePickerComponent,
    PageCountDisplayComponent,
    AutoCompleteMultiSelectComponent,
    SearchFilterTemplateComponent,
    DatePickerComponent
  ],
  entryComponents: [
  ],
  exports: [
    MatSlideToggleModule,
    MatSnackBarModule,
    NgZorroAntdModule,

    TableRowDirective,
    TableTemplateComponent,
    PageSizePickerComponent,
    PageCountDisplayComponent,
    AutoCompleteMultiSelectComponent,
    SearchFilterTemplateComponent,
    DatePickerComponent
  ],
  providers: [
    TableTemplate,
    Utils,
    { provide: NZ_I18N, useValue: en_US }
  ]
})

export class SharedModule { }
