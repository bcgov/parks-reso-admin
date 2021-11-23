import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'app/shared/shared.module';

import { ParkListComponent } from './park-list/park-list.component';
import { ParkTableRowComponent } from './park-list/park-table-row/park-table-row.component';
import { RouterModule } from '@angular/router';
import { ParksComponent } from './parks.component';
import { ParkFormComponent } from '../park-form/park-form.component';
import { ParkModule } from 'app/park/park.module';
import { ParksRoutes } from './parks-routes';
import { ParksResolverService } from './parks-resolver.service';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

@NgModule({
  declarations: [
    ParkFormComponent,
    ParkListComponent,
    ParkTableRowComponent,
    ParksComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forRoot(ParksRoutes),
    ReactiveFormsModule,
    ParkModule,
    EditorModule
  ],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
    ParksResolverService
  ],
  entryComponents: [
    ParkTableRowComponent
  ]
})
export class ParksModule { }
