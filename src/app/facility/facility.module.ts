import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';

import { RouterModule } from '@angular/router';
import { FacilityComponent } from './facility.component';
import { FacilityDetailsComponent } from './facility-details/facility-details.component';
import { PassesModule } from 'app/passes/passes.module';
import { FacilityEditComponent } from './facility-edit/facility-edit.component';

@NgModule({
  declarations: [
    FacilityComponent,
    FacilityDetailsComponent,
    FacilityEditComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    PassesModule
  ],
  entryComponents: []
})
export class FacilityModule { }
