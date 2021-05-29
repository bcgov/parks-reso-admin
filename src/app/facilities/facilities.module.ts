import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacilitiesComponent } from './facilities.component';
import { FacilityAddComponent } from './facility-add/facility-add.component';
import { FacilityListComponent } from './facility-list/facility-list.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { FacilityTableRowComponent } from './facility-list/facility-table-row/facility-table-row.component';

@NgModule({
  declarations: [
    FacilitiesComponent,
    FacilityAddComponent,
    FacilityListComponent,
    FacilityTableRowComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    FacilityListComponent
  ],
  entryComponents: [
    FacilityTableRowComponent
  ]
})
export class FacilitiesModule { }
