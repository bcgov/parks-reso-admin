import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';

import { RouterModule } from '@angular/router';
import { FacilityComponent } from './facility.component';
import { FacilityDetailsComponent } from './facility-details/facility-details.component';

@NgModule({
  declarations: [
    FacilityComponent,
    FacilityDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
  ],
  entryComponents: []
})
export class FacilityModule { }
