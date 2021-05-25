import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParksComponent } from './parks.component';
import { ParksDetailComponent } from './parks-detail/parks-detail.component';
import { ParksAddComponent } from './parks-add/parks-add.component';
import { ParksEditComponent } from './parks-edit/parks-edit.component';
import { ParksListComponent } from './parks-list/parks-list.component';



@NgModule({
  declarations: [
    ParksComponent,
    ParksDetailComponent,
    ParksAddComponent,
    ParksEditComponent,
    ParksListComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ParksModule { }
