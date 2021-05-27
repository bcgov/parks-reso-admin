import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'app/shared/shared.module';

import { ParkListComponent } from './park-list/park-list.component';
import { ParkTableRowComponent } from './park-list/park-table-row/park-table-row.component';
import { RouterModule } from '@angular/router';
import { ParksComponent } from './parks.component';
import { ParkFormComponent } from '../park-form/park-form.component';

@NgModule({
  declarations: [
    ParkFormComponent,
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
