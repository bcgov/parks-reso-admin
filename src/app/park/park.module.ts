import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';

import { RouterModule } from '@angular/router';
import { ParkComponent } from './park.component';
import { ParkDetailsComponent } from './park-details/park-details.component';
import { ParkEditComponent } from 'app/park/park-edit/park-edit.component';

@NgModule({
  declarations: [
    ParkComponent,
    ParkEditComponent,
    ParkDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ],
  entryComponents: []
})
export class ParkModule { }
