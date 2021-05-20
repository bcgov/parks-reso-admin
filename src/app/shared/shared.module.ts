import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSlideToggleModule, MatMenuModule } from '@angular/material';
import { MatSnackBarModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';

import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <== add the imports!
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule,
    BrowserModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    NgbModule
  ],
  declarations: [
  ],
  entryComponents: [
  ],
  exports: [
    MatSlideToggleModule,
    MatSnackBarModule,
    NgZorroAntdModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US }
  ]
})

export class SharedModule { }
