import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { LoggerService } from 'src/app/services/logger.service';
import { PassService } from 'src/app/services/pass.service';
import { QrScannerService } from 'src/app/shared/components/qr-scanner/qr-scanner.service';
import { Constants } from 'src/app/shared/utils/constants';

@Component({
  selector: 'app-pass-lookup',
  templateUrl: './pass-lookup.component.html',
  styleUrls: ['./pass-lookup.component.scss'],
})
export class PassLookupComponent implements OnDestroy {
  private subscriptions = new Subscription();

  public pass;
  public submitLoading = false;

  public passState = Constants.stateLabelDictionary.none;
  public isScanning = true;

  constructor(
    private passService: PassService,
    private logger: LoggerService,
    private dataService: DataService,
    private qrScannerService: QrScannerService
  ) {
    // Get from resolver:
    this.subscriptions.add(
      this.dataService
        .watchItem(Constants.dataIds.PASS_QR_CODE)
        .subscribe((res) => {
          this.pass = res;
          if (this.pass) {
            this.processPass();
          }
        })
    );
  }

  processPass() {
    // TODO: Start fancy loading bar stuff
    // TODO: If we got a pass successfully, make a noise
    this.isScanning = false;
    this.pass['parkName'] = this.pass.pk.split('pass::')[1];
    this.pass['fullName'] = `${this.pass.firstName} ${this.pass.lastName}`;

    if (this.pass['checkedInTime']) {
      const checkedInTime = new Date(this.pass['checkedInTime']);
      this.pass['checkedInTime'] = `${checkedInTime.toLocaleDateString(
        'en-CA'
      )} ${checkedInTime.toLocaleTimeString('en-CA')}`;
      if (
        this.pass.passStatus === 'active' ||
        this.pass.passStatus === 'reserved'
      ) {
        this.pass.passStatus = 'checkedIn';
      }
    }

    if (this.pass.passStatus in Constants.stateLabelDictionary) {
      this.passState = Constants.stateLabelDictionary[this.pass.passStatus];
      // TODO: if the person is early, allow but have a warning.
    } else {
      this.passState = Constants.stateLabelDictionary.none;
    }
    // TODO: End fancy loading bar stuff
  }

  async checkIn() {
    this.submitLoading = true;
    const res = await this.passService.checkInPass(
      this.pass['parkName'],
      this.pass['registrationNumber']
    );
    this.logger.debug(JSON.stringify(res));
    this.pass = null;
    this.submitLoading = false;

    //TODO: Check in loop in case internet sucks
    //TODO: check in success noise
    //TODO: visual for successful check in

    this.qrScannerService.enableScanner();
  }

  async checkOut() {
    this.submitLoading = true;
    const res = await this.passService.checkOutPass(
      this.pass['parkName'],
      this.pass['registrationNumber']
    );
    this.logger.debug(JSON.stringify(res));
    this.pass = null;
    this.submitLoading = false;

    //TODO: check out success noise
    this.qrScannerService.enableScanner();
  }

  enableScanner() {
    this.qrScannerService.enableScanner();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
