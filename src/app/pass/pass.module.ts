import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PassComponent } from './pass.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    PassComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    NgbModule
  ],
  exports: [],
  bootstrap: [],
  entryComponents: []
})
export class PassModule { }
