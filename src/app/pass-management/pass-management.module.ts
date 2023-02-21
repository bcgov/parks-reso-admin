import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PassManagementComponent } from './pass-management.component';
import { QrScannerModule } from '../shared/components/qr-scanner/qr-scanner.module';
import { ManualEntryComponent } from './manual-entry/manual-entry.component';
import { PassCheckInListComponent } from './pass-check-in-list/pass-check-in-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QrResultComponent } from './qr-result/qr-result.component';

@NgModule({
  declarations: [
    PassManagementComponent,
    ManualEntryComponent,
    PassCheckInListComponent,
    QrResultComponent,
  ],
  imports: [CommonModule, QrScannerModule, FormsModule, ReactiveFormsModule],
})
export class PassManagementModule {}
