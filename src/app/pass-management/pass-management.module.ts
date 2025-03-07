import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PassManagementComponent } from './pass-management.component';

import { ManualEntryComponent } from './manual-entry/manual-entry.component';
import { PassCheckInListComponent } from './pass-check-in-list/pass-check-in-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { QrResultComponent } from './qr-result/qr-result.component';
import { PassCheckInComponent } from './pass-check-in/pass-check-in.component';
import { RouterModule } from '@angular/router';
import { PassManagementRoutingModule } from './pass-management-routing.module';
import { PassSearchComponent } from './pass-search/pass-search.component';

import { PassManagementHomeComponent } from './pass-management-home/pass-management-home.component';
import { PassesCapacityBarComponent } from './pass-search/passes-capacity-bar/passes-capacity-bar.component';
import { PassesFilterComponent } from './pass-search/passes-filter/passes-filter.component';
import { PassesListComponent } from './pass-search/passes-list/passes-list.component';
import { PassesUtilityButtonsComponent } from './pass-search/passes-utility-buttons/passes-utility-buttons.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { DsFormsModule } from '../shared/components/ds-forms/ds-forms.module';

import { PassesFilterFieldsComponent } from './pass-search/passes-filter/passes-filter-fields/passes-filter-fields.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PassAccordionComponent } from './pass-search/passes-list/pass-accordion/pass-accordion.component';

@NgModule({
    imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    PassManagementRoutingModule,
    DsFormsModule,
    NgbModule,
    PassManagementComponent,
    ManualEntryComponent,
    PassCheckInListComponent,
    QrResultComponent,
    PassCheckInComponent,
    PassSearchComponent,
    PassManagementHomeComponent,
    PassesCapacityBarComponent,
    PassesFilterComponent,
    PassesListComponent,
    PassesUtilityButtonsComponent,
    PassesFilterFieldsComponent,
    PassAccordionComponent
],
    providers: [BsModalService],
})
export class PassManagementModule { }
