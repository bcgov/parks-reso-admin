import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PassManagementComponent } from './pass-management.component';
import { QrScannerModule } from '../shared/components/qr-scanner/qr-scanner.module';

@NgModule({
  declarations: [PassManagementComponent],
  imports: [CommonModule, QrScannerModule],
})
export class PassManagementModule {}
