import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'app/shared/shared.module';

import { ParkListComponent } from './park-list/park-list.component';
import { ParkTableRowComponent } from './park-list/park-table-row/park-table-row.component';
import { RouterModule } from '@angular/router';
import { ParksComponent } from './parks.component';
import { ParkAddComponent } from './park-add/park-add.component';

@NgModule({
  declarations: [
    ParkAddComponent,
    ParkListComponent,
    ParkTableRowComponent,
    ParksComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    ParkTableRowComponent
  ]
})
export class ParksModule { }
