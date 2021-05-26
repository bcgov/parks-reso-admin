import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParksComponent } from './parks.component';
import { ParksDetailComponent } from './parks-detail/parks-detail.component';
import { ParksAddComponent } from './parks-add/parks-add.component';
import { ParksEditComponent } from './parks-edit/parks-edit.component';
import { ParksListComponent } from './parks-list/parks-list.component';
import { ParksFeatureComponent } from './parks-feature/parks-feature.component';
import { ParksFeatureAddComponent } from './parks-feature/parks-feature-add/parks-feature-add.component';
import { ParksFeatureEditComponent } from './parks-feature/parks-feature-edit/parks-feature-edit.component';



@NgModule({
  declarations: [
    ParksComponent,
    ParksDetailComponent,
    ParksAddComponent,
    ParksEditComponent,
    ParksListComponent,
    ParksFeatureComponent,
    ParksFeatureAddComponent,
    ParksFeatureEditComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ParksComponent,
    ParksDetailComponent,
    ParksAddComponent,
    ParksEditComponent,
    ParksListComponent
  ]
})
export class ParksModule { }
