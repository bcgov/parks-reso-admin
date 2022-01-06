import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  MatSlideToggleModule,
  MatMenuModule,
  MatSelectModule,
  MatTooltipModule,
  MatCheckboxModule,
  MatTableModule
} from '@angular/material';
import { MatSnackBarModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';

import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <== add the imports!
import { RouterModule } from '@angular/router';
import { PageSizePickerComponent } from './components/page-size-picker/page-size-picker.component';
import { PageCountDisplayComponent } from './components/page-count-display/page-count-display.component';
import { TableTemplate } from './components/table-template/table-template';
import { Utils } from './utils/utils';
import { SearchFilterTemplateComponent } from './components/search-filter-template/search-filter-template.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { TableRowDirective } from './components/table-template/table-row.directive';
import { TableTemplateComponent } from './components/table-template/table-template.component';
import { ListComponent } from './components/list/list.component';
import { DatePickerModule } from './components/date-picker/date-picker.module';
import { AutoCompleteMultiSelectModule } from './components/autocomplete-multi-select/autocomplete-multi-select.module';

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
    MatSelectModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatTableModule,
    DatePickerModule,
    AutoCompleteMultiSelectModule
  ],
  declarations: [
    PageSizePickerComponent,
    PageCountDisplayComponent,
    SearchFilterTemplateComponent,
    TableRowDirective,
    TableTemplateComponent,
    ListComponent
  ],
  entryComponents: [],
  exports: [
    MatSlideToggleModule,
    MatSnackBarModule,
    NgZorroAntdModule,
    PageSizePickerComponent,
    PageCountDisplayComponent,
    SearchFilterTemplateComponent,
    TableRowDirective,
    TableTemplateComponent,
    ListComponent
  ],
  providers: [TableTemplate, Utils, { provide: NZ_I18N, useValue: en_US }]
})
export class SharedModule {}
