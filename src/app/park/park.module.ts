import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';

import { RouterModule } from '@angular/router';
import { ParkComponent } from './park.component';
import { ParkDetailsComponent } from './park-details/park-details.component';
import { FacilitiesModule } from 'app/facilities/facilities.module';
import { ParkRoutes } from './park-routes';

@NgModule({
  declarations: [
    ParkComponent,
    ParkDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forRoot(ParkRoutes),
    FacilitiesModule
  ],
  entryComponents: []
})
export class ParkModule { }
