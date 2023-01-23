import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.scss'],
})
export class QrScannerComponent {
  constructor(private logger: LoggerService) {}
  @Input() scannerEnabled = true;
  @Output() url: EventEmitter<any> = new EventEmitter();

  availableDevices: MediaDeviceInfo[];
  deviceCurrent: MediaDeviceInfo;
  deviceSelected: string;

  formatsEnabled: BarcodeFormat[] = [BarcodeFormat.QR_CODE];

  hasDevices: boolean;
  hasPermission: boolean;

  qrResultString: string;

  scanningState = 'disabled';

  clearResult(): void {
    this.qrResultString = null;
    this.scanningState = 'scanning';
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
  }

  onCodeResult(resultString: string) {
    if (resultString !== this.qrResultString) {
      this.scanningState = 'found';
      this.qrResultString = resultString;
      this.url.emit(this.qrResultString);
    }
  }

  onCodeError(error: Error) {
    this.logger.error(error);
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  onDeviceSelectChange(selected: string) {
    const selectedStr = selected || '';
    if (this.deviceSelected === selectedStr) {
      return;
    }
    this.deviceSelected = selectedStr;
    const device = this.availableDevices.find((x) => x.deviceId === selected);
    this.deviceCurrent = device || undefined;
  }

  onDeviceChange(device: MediaDeviceInfo) {
    const selectedStr = device?.deviceId || '';
    if (this.deviceSelected === selectedStr) {
      return;
    }
    this.deviceSelected = selectedStr;
    this.deviceCurrent = device || undefined;
    if (this.deviceCurrent) {
      this.scanningState = 'scanning';
    }
  }

  onHasPermission(has: boolean) {
    this.hasPermission = has;
  }
}
