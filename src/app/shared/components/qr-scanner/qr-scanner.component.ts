import { Component, OnDestroy } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { LoggerService } from 'src/app/services/logger.service';
import { QrScannerService } from './qr-scanner.service';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.scss'],
})
export class QrScannerComponent implements OnDestroy {
  private subscriptions = new Subscription();

  scannerEnabled = true;
  // NOTE: This flag is to temp fix this:
  // https://github.com/zxing-js/ngx-scanner/issues/267
  showScannerComponent = true;

  availableDevices: MediaDeviceInfo[];
  deviceCurrent: MediaDeviceInfo;
  deviceSelected: string;

  formatsEnabled: BarcodeFormat[] = [BarcodeFormat.QR_CODE];

  hasDevices: boolean;
  hasPermission: boolean;

  qrResultString: string;

  scanningState = 'disabled';

  showScanIndicator = true;

  tryHarder = true;

  constructor(
    private logger: LoggerService,
    public apiService: ApiService,
    private qrScannerService: QrScannerService
  ) {
    this.qrScannerService.enableScanner();
    this.subscriptions.add(
      this.qrScannerService.watchScannerState().subscribe((res) => {
        if (res === true) {
          this.clearResult();
          this.showScannerComponent = true;
        } else {
          this.showScannerComponent = false;
        }
        this.scannerEnabled = res;
      })
    );
  }

  clearResult(): void {
    this.qrResultString = null;
    this.scanningState = 'scanning';
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
  }

  onCodeResult(resultString: string) {
    // Hide this when offline so as not to confuse the user.
    if (resultString !== this.qrResultString && this.apiService.isNetworkOffline === false) {
      this.scanningState = 'found';
      this.qrResultString = resultString;
      this.qrScannerService.setScannerOutput(this.qrResultString);
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
    if (!this.deviceCurrent) {
      this.showScanIndicator = false;
    } else {
      this.showScanIndicator = true;
    }
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

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
