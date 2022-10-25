import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacilityDetailsComponent } from './facility-details/facility-details.component';
import { FacilityEditComponent } from './facility-edit/facility-edit.component';
import { TableModule } from '../shared/components/table/table.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [FacilityDetailsComponent, FacilityEditComponent],
  imports: [CommonModule, TableModule, RouterModule],
})
export class FacilitiesModule {}
