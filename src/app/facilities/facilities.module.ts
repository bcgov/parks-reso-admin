import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacilityDetailsComponent } from './facility-details/facility-details.component';
import { TableModule } from '../shared/components/table/table.module';
import { RouterModule } from '@angular/router';
import { PassesListComponent } from './facility-details/passes-list/passes-list.component';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { DsModalModule } from '../shared/components/modal/ds-modal.module';
import { PassesFilterComponent } from './facility-details/passes-filter/passes-filter.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PassesFilterFieldsComponent } from './facility-details/passes-filter/passes-filter-fields/passes-filter-fields.component';
import { DsFormsModule } from '../shared/components/ds-forms/ds-forms.module';
import { FacilityEditFormComponent } from './facility-edit/facility-edit-form/facility-edit-form.component';
import { FacilityEditComponent } from './facility-edit/facility-edit.component';
import { FacilityEditFormPublishingDetailsComponent } from './facility-edit/facility-edit-form/facility-edit-form-publishing-details/facility-edit-form-publishing-details.component';
import { FacilityEditFormDetailsComponent } from './facility-edit/facility-edit-form/facility-edit-form-details/facility-edit-form-details.component';
import { FacilityEditFormPassRequirementsComponent } from './facility-edit/facility-edit-form/facility-edit-form-pass-requirements/facility-edit-form-pass-requirements.component';
import { FacilityEditFormCapacityChangesComponent } from './facility-edit/facility-edit-form/facility-edit-form-capacity-changes/facility-edit-form-capacity-changes.component';

@NgModule({
  declarations: [
    FacilityDetailsComponent,
    FacilityEditComponent,
    PassesListComponent,
    PassesFilterComponent,
    PassesFilterFieldsComponent,
    FacilityEditFormComponent,
    FacilityEditFormPublishingDetailsComponent,
    FacilityEditFormDetailsComponent,
    FacilityEditFormPassRequirementsComponent,
    FacilityEditFormCapacityChangesComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    RouterModule,
    ModalModule,
    DsModalModule,
    ReactiveFormsModule,
    DsFormsModule,
  ],
  providers: [BsModalService],
})
export class FacilitiesModule {}
