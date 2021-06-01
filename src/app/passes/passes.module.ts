import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PassListComponent } from './pass-list/pass-list.component';
import { PassTableRowComponent } from './pass-list/pass-table-row/pass-table-row.component';
import { PassesComponent } from './passes.component';
import { SharedModule } from 'app/shared/shared.module';



@NgModule({
  declarations: [
    PassesComponent,
    PassListComponent,
    PassTableRowComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    PassListComponent
  ],
  entryComponents: [
    PassTableRowComponent
  ]
})
export class PassesModule { }
