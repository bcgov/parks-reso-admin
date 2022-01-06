import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';

import { RouterModule } from '@angular/router';
import { FacilityComponent } from './facility.component';
import { FacilityDetailsComponent } from './facility-details/facility-details.component';
import { PassesModule } from 'app/passes/passes.module';
import { FacilityEditComponent } from './facility-edit/facility-edit.component';
import { FacilityRoutes } from './facility-routes';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormGeneratorModule } from 'app/shared/form-generator/form-generator.module';

@NgModule({
  declarations: [FacilityComponent, FacilityDetailsComponent, FacilityEditComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forRoot(FacilityRoutes),
    PassesModule,
    FormsModule,
    NgbModule,
    FormGeneratorModule
  ],
  entryComponents: []
})
export class FacilityModule {}
