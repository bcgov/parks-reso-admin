import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';

import { ParkDetailsComponent } from './park-details/park-details.component';
import { ParkAddComponent } from './park-add/park-add.component';
import { ParkEditComponent } from './park-edit/park-edit.component';
import { ParkListComponent } from './park-list/park-list.component';
import { ParkTableRowComponent } from './park-list/park-table-row/park-table-row.component';

@NgModule({
  declarations: [
    ParkDetailsComponent,
    ParkAddComponent,
    ParkEditComponent,
    ParkListComponent,
    ParkTableRowComponent,
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  entryComponents: [
    ParkTableRowComponent
  ]
})
export class ParksModule { }
