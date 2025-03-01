import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParksManagementRoutingModule } from './parks-management-routing.module';
import { ParksListComponent } from './parks-list/parks-list.component';
import { RouterModule } from '@angular/router';

import { ParkEditComponent } from './park-edit/park-edit.component';
import { ParkDetailsComponent } from './park-details/park-details.component';
import { ParksManagementComponent } from './parks-management.component';
import { FacilityEditComponent } from './facility-edit/facility-edit.component';
import { FacilityDetailsComponent } from './facility-details/facility-details.component';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';

import { ReactiveFormsModule } from '@angular/forms';
import { DsFormsModule } from '../shared/components/ds-forms/ds-forms.module';
import { FacilityEditFormDetailsComponent } from './facility-edit/facility-edit-form/facility-edit-form-details/facility-edit-form-details.component';
import { FacilityEditFormPassRequirementsComponent } from './facility-edit/facility-edit-form/facility-edit-form-pass-requirements/facility-edit-form-pass-requirements.component';
import { FacilityEditFormPublishingDetailsComponent } from './facility-edit/facility-edit-form/facility-edit-form-publishing-details/facility-edit-form-publishing-details.component';
import { FacilityEditFormComponent } from './facility-edit/facility-edit-form/facility-edit-form.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModifiersListComponent } from './modifiers-list/modifiers-list.component';
import { ModifiersFormComponent } from './modifiers-form/modifiers-form.component';
import { ParkEditFormComponent } from './park-edit-form/park-edit-form.component';



@NgModule({
    imports: [
    CommonModule,
    RouterModule,
    ModalModule,
    ReactiveFormsModule,
    DsFormsModule,
    ParksManagementRoutingModule,
    NgbModule,
    ParksManagementComponent,
    ParksListComponent,
    ParkEditComponent,
    ParkDetailsComponent,
    FacilityDetailsComponent,
    FacilityEditComponent,
    FacilityEditFormComponent,
    FacilityEditFormPublishingDetailsComponent,
    FacilityEditFormDetailsComponent,
    FacilityEditFormPassRequirementsComponent,
    ModifiersListComponent,
    ModifiersFormComponent,
    ParkEditFormComponent,
],
    providers: [BsModalService],
})
export class ParksManagementModule {}
