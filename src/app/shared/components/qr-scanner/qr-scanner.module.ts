import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrScannerComponent } from './qr-scanner.component';
import { ZXingScannerModule } from '@digitalspace/ngx-scanner';

@NgModule({
  declarations: [QrScannerComponent],
  imports: [CommonModule, ZXingScannerModule],
  exports: [QrScannerComponent],
})
export class QrScannerModule {}
