import { Component, ViewChild } from '@angular/core';
import { LoggerService } from '../services/logger.service';
import { PassService } from '../services/pass.service';
import { ToastService } from '../services/toast.service';
import { QrScannerComponent } from '../shared/components/qr-scanner/qr-scanner.component';
import { Constants } from '../shared/utils/constants';

@Component({
  selector: 'app-pass-management',
  templateUrl: './pass-management.component.html',
  styleUrls: ['./pass-management.component.scss'],
})
export class PassManagementComponent {
  @ViewChild(QrScannerComponent) qrScannerComponent: QrScannerComponent;

  public pass;
  public canCheckIn = false;
  public checkInLoading = false;
  public canCheckOut = false;
  public checkOutLoading = false;

  public mode = 'camera';

  public passState = Constants.stateLabelDictionary.none;
  public isScanning = true;

  constructor(
    private passService: PassService,
    private logger: LoggerService,
    private toastService: ToastService
  ) {}

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
        this.getPass(park, passId);
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
      this.pass = await this.passService.fetchData({
        park: park,
        passId: passId,
      });
    } catch (e) {
      this.logger.error(e);
    }
    // TODO: If we got a pass successfully, make a noise
    this.isScanning = false;
    this.pass['parkName'] = park;
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
      switch (this.passState.state) {
        case 'active':
        case 'reserved':
          // TODO: if the person is early, allow but have a warning.
          this.canCheckIn = true;
          break;
        case 'checkedIn':
          this.canCheckOut = true;
          break;
        default:
          break;
      }
    } else {
      this.passState = Constants.stateLabelDictionary.none;
    }
    // TODO: End fancy loading bar stuff
  }

  async checkIn() {
    this.checkInLoading = true;
    const res = await this.passService.checkInPass(
      this.pass['parkName'],
      this.pass['registrationNumber']
    );
    this.logger.debug(res);
    this.canCheckIn = false;
    this.checkInLoading = false;
    this.pass = null;

    //TODO: Check in loop in case internet sucks
    //TODO: check in success noise
    //TODO: visual for successful check in

    this.dismiss();
  }

  async checkOut() {
    this.checkOutLoading = true;
    const res = await this.passService.checkOutPass(
      this.pass['parkName'],
      this.pass['registrationNumber']
    );
    this.logger.debug(JSON.stringify(res));
    this.canCheckOut = false;
    this.checkOutLoading = false;
    this.pass = null;

    //TODO: check out success noise

    this.dismiss();
  }

  dismiss() {
    this.qrScannerComponent.clearResult();
    this.isScanning = true;
  }
}
