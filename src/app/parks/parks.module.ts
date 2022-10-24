import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from '../shared/components/table/table.module';
import { ParksListComponent } from './parks-list/parks-list.component';
import { ParkDetailsComponent } from './park-details/park-details.component';
import { ParkEditComponent } from './park-edit/park-edit.component';
import { ParkEditButtonComponent } from './parks-list/park-edit-button/park-edit-button.component';
import { FacilitiesListComponent } from './park-details/facilities-list/facilities-list.component';



@NgModule({
  declarations: [
    ParksListComponent,
    ParkDetailsComponent,
    ParkEditComponent,
    ParkEditButtonComponent,
    FacilitiesListComponent
  ],
  imports: [
    CommonModule,
    TableModule
  ],
  exports: [

  ]
})
export class ParksModule { }
