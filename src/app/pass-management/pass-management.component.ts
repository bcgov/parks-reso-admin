import { Component, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from '../services/data.service';
import { LoggerService } from '../services/logger.service';
import { PassService } from '../services/pass.service';
import { ToastService } from '../services/toast.service';
import { QrScannerComponent } from '../shared/components/qr-scanner/qr-scanner.component';
import { QrScannerService } from '../shared/components/qr-scanner/qr-scanner.service';
import { Constants } from '../shared/utils/constants';

@Component({
  selector: 'app-pass-management',
  templateUrl: './pass-management.component.html',
  styleUrls: ['./pass-management.component.scss'],
})
export class PassManagementComponent implements OnDestroy {
  @ViewChild(QrScannerComponent) qrScannerComponent: QrScannerComponent;

  private subscriptions = new Subscription();

  public mode = 'camera';
  public scannerSwitch = false;
  public passes = [];

  constructor(
    private passService: PassService,
    private logger: LoggerService,
    private qrScannerService: QrScannerService,
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router,
    private toastService: ToastService
  ) {
    if (
      this.route.snapshot.queryParamMap.get('park') &&
      this.route.snapshot.queryParamMap.get('registrationNumber')
    ) {
      this.getPass(
        this.route.snapshot.queryParamMap.get('park'),
        this.route.snapshot.queryParamMap.get('registrationNumber')
      );
      // Clear query params after getting pass
      this.router.navigate([], { queryParams: {} });
    }

    this.subscriptions.add(
      this.qrScannerService.watchScannerState().subscribe((res) => {
        this.scannerSwitch = res;
      })
    );

    this.subscriptions.add(
      this.qrScannerService.watchScannerOutput().subscribe(async (res) => {
        if (res) {
          await this.processUrl(res);
        }
      })
    );

    this.subscriptions.add(
      this.dataService
        .watchItem(Constants.dataIds.PASS_CHECK_IN_LIST)
        .subscribe((res) => {
          if (res) {
            this.passes = res;
          }
        })
    );
  }

  passCheckInListEvent(event) {
    this.dataService.setItemValue(
      Constants.dataIds.PASS_CHECK_IN_LIST_EVENT,
      event
    );
  }

  setMode(modeToSet) {
    this.mode = modeToSet;
    if (this.mode === 'camera') {
      this.qrScannerComponent.clearResult();
      this.qrScannerService.enableScanner();
    }
    this.passes = [];
  }

  async processUrl(url) {
    this.logger.debug('QR Detected: ' + url);
    try {
      if (url) {
        const urlParams = new URL(url);
        const park = urlParams.searchParams.get('park');
        // This is not a mistake, it comes in as registrationNumber
        // We set to passId
        const passId = urlParams.searchParams.get('registrationNumber');
        if (park && passId) {
          await this.getPass(park, passId);
        } else {
          throw 'Invalid QR Code.';
        }
      } else {
        throw 'Invalid QR Code.';
      }
    } catch (error) {
      this.logger.error(error);
      this.toastService.addMessage(
        String(error),
        'QR Service',
        Constants.ToastTypes.ERROR
      );
      this.qrScannerComponent.scanningState = 'scanning';
    }
  }

  async getPass(park, passId) {
    // TODO: Start fancy loading bar stuff
    let res;
    try {
      res = await this.passService.fetchData({
        park: park,
        passId: passId,
      });
    } catch (error) {
      if (error === 'Network Offline') {
        // In this mode, the service layer will pop a message instead. We don't want
        // multiple msgs.
        return;
      } else {
        this.logger.error(error);
        throw 'Error connecting to server. Please refresh the page.';
      }
    }
    if (res && res.length > 0) {
      // TODO: If we got a pass successfully, make a noise
      this.qrScannerService.disableScanner();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.qrScannerService.clearScannerOutput();
    this.dataService.setItemValue(Constants.dataIds.PASS_CHECK_IN_LIST, []);
  }
}
