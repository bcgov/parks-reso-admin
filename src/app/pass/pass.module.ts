import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PassComponent } from './pass.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PassDetailsComponent } from './pass-details/pass-details.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    PassComponent,
    PassDetailsComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    NgbModule
  ],
  exports: [],
  bootstrap: [],
  entryComponents: []
})
export class PassModule { }
