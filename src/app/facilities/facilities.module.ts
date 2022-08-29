import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacilitiesComponent } from './facilities.component';
import { FacilityAddComponent } from './facility-add/facility-add.component';
import { FacilityListComponent } from './facility-list/facility-list.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { FacilityTableRowComponent } from './facility-list/facility-table-row/facility-table-row.component';
import { FacilityModule } from 'app/facility/facility.module';
import { FacilitiesRoutes } from './facilities-routes';
import { FacilityFormComponent } from 'app/facility-form/facility-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModifierFormComponent } from 'app/facility-form/modifier-form/modifier-form.component';
import { DatePickerModule } from 'app/shared/components/date-picker/date-picker.module';
import { ModifierService } from 'app/services/modifier.service';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

@NgModule({
  declarations: [
    FacilitiesComponent,
    FacilityAddComponent,
    FacilityListComponent,
    FacilityTableRowComponent,
    FacilityFormComponent,
    ModifierFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot(FacilitiesRoutes),
    SharedModule,
    FacilityModule,
    ReactiveFormsModule,
    FormsModule,
    DatePickerModule,
    EditorModule
  ],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
    ModifierService
  ],
  exports: [FacilityListComponent],
  entryComponents: [FacilityTableRowComponent]
})
export class FacilitiesModule {}
