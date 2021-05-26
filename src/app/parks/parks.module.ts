import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';

import { ParkDetailsComponent } from './park-details/park-details.component';
import { ParkAddComponent } from './park-add/park-add.component';
import { ParkEditComponent } from './park-edit/park-edit.component';
import { ParkListComponent } from './park-list/park-list.component';
import { ParkTableRowComponent } from './park-list/park-table-row/park-table-row.component';
import { RouterModule } from '@angular/router';
import { ParksComponent } from './parks.component';

@NgModule({
  declarations: [
    ParkDetailsComponent,
    ParkAddComponent,
    ParkEditComponent,
    ParkListComponent,
    ParkTableRowComponent,
    ParksComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ],
  entryComponents: [
    ParkTableRowComponent
  ]
})
export class ParksModule { }
