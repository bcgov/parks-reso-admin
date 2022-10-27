import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacilityDetailsComponent } from './facility-details/facility-details.component';
import { FacilityEditComponent } from './facility-edit/facility-edit.component';
import { TableModule } from '../shared/components/table/table.module';
import { RouterModule } from '@angular/router';
import { PassesListComponent } from './facility-details/passes-list/passes-list.component';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { DsModalModule } from '../shared/components/modal/ds-modal.module';
import { PassesFilterComponent } from './facility-details/passes-filter/passes-filter.component';
import { BaseFormModule } from '../shared/components/forms/base-form/base-form.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PassesFilterFieldsComponent } from './facility-details/passes-filter/passes-filter-fields/passes-filter-fields.component';
import { TextInputModule } from '../shared/components/forms/text-input/text-input.module';
import { DatePickerModule } from '../shared/components/date-picker/date-picker.module';

@NgModule({
  declarations: [
    FacilityDetailsComponent,
    FacilityEditComponent,
    PassesListComponent,
    PassesFilterComponent,
    PassesFilterFieldsComponent,
  ],
  imports: [
    CommonModule,
    TableModule,
    RouterModule,
    ModalModule,
    DsModalModule,
    BaseFormModule,
    ReactiveFormsModule,
    TextInputModule,
    DatePickerModule,
  ],
  providers: [BsModalService],
})
export class FacilitiesModule {}
