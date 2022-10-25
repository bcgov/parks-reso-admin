import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from '../shared/components/table/table.module';
import { ParksListComponent } from './parks-list/parks-list.component';
import { ParkDetailsComponent } from './park-details/park-details.component';
import { ParkEditComponent } from './park-edit/park-edit.component';
import { FacilitiesListComponent } from './park-details/facilities-list/facilities-list.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ParksListComponent,
    ParkDetailsComponent,
    ParkEditComponent,
    FacilitiesListComponent,
  ],
  imports: [
    CommonModule,
    TableModule,
    RouterModule
  ],
  exports: [

  ]
})
export class ParksModule { }
