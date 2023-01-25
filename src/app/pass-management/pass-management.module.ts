import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PassManagementComponent } from './pass-management.component';
import { QrScannerModule } from '../shared/components/qr-scanner/qr-scanner.module';
import { ManualEntryComponent } from './manual-entry/manual-entry.component';
import { PassLookupComponent } from './pass-lookup/pass-lookup.component';

@NgModule({
  declarations: [
    PassManagementComponent,
    ManualEntryComponent,
    PassLookupComponent,
  ],
  imports: [CommonModule, QrScannerModule],
})
export class PassManagementModule {}
