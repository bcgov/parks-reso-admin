import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PassManagementComponent } from './pass-management.component';
import { QrScannerModule } from '../shared/components/qr-scanner/qr-scanner.module';
import { ManualEntryComponent } from './manual-entry/manual-entry.component';
import { PassCheckInListComponent } from './pass-check-in-list/pass-check-in-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { QrResultComponent } from './qr-result/qr-result.component';
import { PassCheckInComponent } from './pass-check-in/pass-check-in.component';
import { RouterModule } from '@angular/router';
import { PassManagementRoutingModule } from './pass-management-routing.module';
import { PassSearchComponent } from './pass-search/pass-search.component';
import { NavCardModule } from '../shared/components/nav-card/nav-card.module';
import { PassManagementHomeComponent } from './pass-management-home/pass-management-home.component';
import { PassesCapacityBarComponent } from './pass-search/passes-capacity-bar/passes-capacity-bar.component';
import { PassesFilterComponent } from './pass-search/passes-filter/passes-filter.component';
import { PassesListComponent } from './pass-search/passes-list/passes-list.component';
import { PassesUtilityButtonsComponent } from './pass-search/passes-utility-buttons/passes-utility-buttons.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FancyHeaderModule } from '../shared/components/fancy-header/fancy-header.module';
import { DsModalModule } from '../shared/components/modal/ds-modal.module';
import { DsFormsModule } from '../shared/components/ds-forms/ds-forms.module';
import { TableModule } from '../shared/components/table/table.module';
import { PassesFilterFieldsComponent } from './pass-search/passes-filter/passes-filter-fields/passes-filter-fields.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PassAccordionComponent } from './pass-search/passes-list/pass-accordion/pass-accordion.component';

@NgModule({
  declarations: [
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
    PassAccordionComponent,
  ],
  imports: [
    CommonModule,
    QrScannerModule,
    RouterModule,
    ReactiveFormsModule,
    PassManagementRoutingModule,
    DsModalModule,
    DsFormsModule,
    NavCardModule,
    TableModule,
    NgbModule,
    FancyHeaderModule
  ],
  providers: [BsModalService],
})
export class PassManagementModule { }
