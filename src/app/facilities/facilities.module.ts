import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacilitiesComponent } from './facilities.component';
import { FacilityAddComponent } from './facility-add/facility-add.component';
import { FacilityEditComponent } from './facility-edit/facility-edit.component';
import { FacilityDetailsComponent } from './facility-details/facility-details.component';
import { FacilityListComponent } from './facility-list/facility-list.component';

@NgModule({
  declarations: [
    FacilitiesComponent,
    FacilityAddComponent,
    FacilityEditComponent,
    FacilityDetailsComponent,
    FacilityListComponent
  ],
  imports: [
    CommonModule
  ]
})
export class FacilitiesModule { }
