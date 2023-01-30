import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoggerService } from '../services/logger.service';
import { PassService } from '../services/pass.service';
import { QrScannerService } from '../shared/components/qr-scanner/qr-scanner.service';

@Component({
  selector: 'app-pass-management',
  templateUrl: './pass-management.component.html',
  styleUrls: ['./pass-management.component.scss'],
})
export class PassManagementComponent implements OnDestroy {
  private subscriptions = new Subscription();

  public mode = 'camera';
  public scannerSwitch = false;

  constructor(
    private passService: PassService,
    private logger: LoggerService,
    private qrScannerService: QrScannerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    if (
      this.route.snapshot.queryParamMap.get('park') &&
      this.route.snapshot.queryParamMap.get('passId')
    ) {
      this.getPass(
        this.route.snapshot.queryParamMap.get('park'),
        this.route.snapshot.queryParamMap.get('passId')
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
  }

  setMode(modeToSet) {
    this.mode = modeToSet;
  }

  async processUrl(url) {
    this.logger.debug('QR Detected: ' + url);
    if (url) {
      const urlParams = new URL(url);
      const park = urlParams.searchParams.get('park');
      // This is not a mistake, it comes in as registrationNumber
      // We set to passId
      const passId = urlParams.searchParams.get('registrationNumber');
      if (park && passId) {
        await this.getPass(park, passId);
      } else {
        // TODO: ERROR
      }
    } else {
      // TODO: ERROR
    }
  }

  async getPass(park, passId) {
    // TODO: Start fancy loading bar stuff
    try {
      const res = await this.passService.fetchData({
        park: park,
        passId: passId,
      });
      if (res) {
        // TODO: If we got a pass successfully, make a noise
        this.qrScannerService.disableScanner();
      } else {
        // TODO: error, scan again
      }
    } catch (e) {
      this.logger.error(e);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.qrScannerService.clearScannerOutput();
  }
}
