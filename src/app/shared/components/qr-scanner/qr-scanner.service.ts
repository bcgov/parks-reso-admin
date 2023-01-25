import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QrScannerService {
  // Scanner Switch
  private scannerSwitch = new BehaviorSubject(false);

  constructor() {}

  watchScannerState() {
    return this.scannerSwitch;
  }

  getScannerState(): boolean {
    return this.scannerSwitch.value;
  }

  enableScanner() {
    this.scannerSwitch.next(true);
  }

  disableScanner() {
    this.scannerSwitch.next(false);
  }

  // Scanner Output
  scannerOutput = new BehaviorSubject(null);

  getScannerOutput(): string {
    return this.scannerOutput.value;
  }

  setScannerOutput(value) {
    if (value) {
      this.scannerOutput.next(value);
    }
  }

  clearScannerOutput() {
    this.scannerOutput.next(null);
  }

  watchScannerOutput() {
    return this.scannerOutput;
  }
}
