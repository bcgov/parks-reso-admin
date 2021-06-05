import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacilitiesComponent } from './facilities.component';
import { FacilityAddComponent } from './facility-add/facility-add.component';
import { FacilityListComponent } from './facility-list/facility-list.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { FacilityTableRowComponent } from './facility-list/facility-table-row/facility-table-row.component';
import { FacilityModule } from 'app/facility/facility.module';
import { FacilitiesRoutes } from './facilities-routes';
import { FacilityFormComponent } from 'app/facility-form/facility-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    FacilitiesComponent,
    FacilityAddComponent,
    FacilityListComponent,
    FacilityTableRowComponent,
    FacilityFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot(FacilitiesRoutes),
    SharedModule,
    FacilityModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    FacilityListComponent
  ],
  entryComponents: [
    FacilityTableRowComponent
  ]
})
export class FacilitiesModule { }
