import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParksManagementRoutingModule } from './parks-management-routing.module';
import { ParksListComponent } from './parks-list/parks-list.component';
import { RouterModule } from '@angular/router';
import { TableModule } from '../shared/components/table/table.module';
import { ParkEditComponent } from './park-edit/park-edit.component';
import { ParkDetailsComponent } from './park-details/park-details.component';
import { ParksManagementComponent } from './parks-management.component';
import { FacilityEditComponent } from './facility-edit/facility-edit.component';
import { FacilityDetailsComponent } from './facility-details/facility-details.component';
import { PassesFilterFieldsComponent } from './facility-details/passes-filter/passes-filter-fields/passes-filter-fields.component';
import { PassesFilterComponent } from './facility-details/passes-filter/passes-filter.component';
import { PassesListComponent } from './facility-details/passes-list/passes-list.component';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { DsModalModule } from '../shared/components/modal/ds-modal.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DsFormsModule } from '../shared/components/ds-forms/ds-forms.module';
import { FacilityEditFormCapacityChangesComponent } from './facility-edit/facility-edit-form/facility-edit-form-capacity-changes/facility-edit-form-capacity-changes.component';
import { FacilityEditFormDetailsComponent } from './facility-edit/facility-edit-form/facility-edit-form-details/facility-edit-form-details.component';
import { FacilityEditFormPassRequirementsComponent } from './facility-edit/facility-edit-form/facility-edit-form-pass-requirements/facility-edit-form-pass-requirements.component';
import { FacilityEditFormPublishingDetailsComponent } from './facility-edit/facility-edit-form/facility-edit-form-publishing-details/facility-edit-form-publishing-details.component';
import { FacilityEditFormComponent } from './facility-edit/facility-edit-form/facility-edit-form.component';

@NgModule({
  declarations: [
    ParksManagementComponent,
    ParksListComponent,
    ParkEditComponent,
    ParkDetailsComponent,
    FacilityDetailsComponent,
    FacilityEditComponent,
    PassesListComponent,
    PassesFilterComponent,
    PassesFilterFieldsComponent,
    FacilityEditFormComponent,
    FacilityEditFormPublishingDetailsComponent,
    FacilityEditFormDetailsComponent,
    FacilityEditFormPassRequirementsComponent,
    FacilityEditFormCapacityChangesComponent,
  ],
  imports: [
    CommonModule,
    TableModule,
    RouterModule,
    ModalModule,
    DsModalModule,
    ReactiveFormsModule,
    DsFormsModule,
    ParksManagementRoutingModule,
  ],
  providers: [BsModalService],
})
export class ParksManagementModule {}
