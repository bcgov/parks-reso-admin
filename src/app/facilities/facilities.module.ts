import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacilityDetailsComponent } from './facility-details/facility-details.component';
import { FacilityEditComponent } from './facility-edit/facility-edit.component';
import { TableModule } from '../shared/components/table/table.module';
import { RouterModule } from '@angular/router';
import { PassesListComponent } from './facility-details/passes-list/passes-list.component';

@NgModule({
  declarations: [FacilityDetailsComponent, FacilityEditComponent, PassesListComponent],
  imports: [CommonModule, TableModule, RouterModule],
})
export class FacilitiesModule {}
