import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { LoggerService } from 'src/app/services/logger.service';
import { PassService } from 'src/app/services/pass.service';
import { Constants } from 'src/app/shared/utils/constants';
import { Utils } from 'src/app/shared/utils/utils';
import { NgIf, NgFor, NgClass } from '@angular/common';

@Component({
    selector: 'app-pass-check-in-list',
    templateUrl: './pass-check-in-list.component.html',
    styleUrls: ['./pass-check-in-list.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        NgFor,
        NgClass,
    ],
})
export class PassCheckInListComponent implements OnChanges, OnDestroy {
  @Input() passes = [];
  @Input() searching = true;
  @Output() event = new EventEmitter();

  private subscriptions = new Subscription();

  constructor(
    private passService: PassService,
    private logger: LoggerService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    // only logged upon a change after rendering
    let res = changes['passes'].currentValue;
    if (res) {
      let greenPasses = [];
      let redPasses = [];
      for (let i = 0; i < res.length; i++) {
        const pass = res[i];
        pass['submitLoading'] = false;
        const processedPass = this.processPass(pass);
        if (pass.passStatus === 'active' || pass.passStatus === 'reserved') {
          greenPasses.push(processedPass);
        } else {
          redPasses.push(processedPass);
        }
        // Logic to sort expired and cancelled passes to end of list
        this.passes = greenPasses.concat(redPasses);
      }
    }
  }

  processPass(pass) {
    // TODO: Start fancy loading bar stuff
    // TODO: If we got a pass successfully, make a noise
    pass['parkName'] = pass.parkName;
    pass['fullName'] = `${pass.firstName} ${pass.lastName}`;
    pass['facilityString'] = `${pass.facilityName} (${pass.type})`;

    if (pass['checkedInTime']) {
      const checkedInTime = new Date(pass['checkedInTime']);
      pass['checkedInTime'] = `${checkedInTime.toLocaleDateString(
        'en-CA'
      )} ${checkedInTime.toLocaleTimeString('en-CA')}`;
      if (pass.passStatus === 'active' || pass.passStatus === 'reserved') {
        pass.passStatus = 'checkedIn';
      }
    } else if (
      pass.passStatus === 'reserved' &&
      pass.shortPassDate > new Utils().getTodayAsShortDate()
    ) {
      // Pass is reserved but it's not day of.
      // Biz rule: We allow early check-in for day of only.
      pass.passStatus = 'reservedFuture';
    }

    pass.passState = Constants.stateLabelDictionary[pass.passStatus];
    // TODO: End fancy loading bar stuff

    return pass;
  }

  async checkIn(pass) {
    pass.submitLoading = true;
    let res;
    let event = {};

    let orcId = '';
    if (pass['pk']) {
      orcId = pass['pk'].split('::')[1];
    } else if (pass['park']) {
      orcId = pass['park'];
    }

    if (pass.passStatus === 'checkedIn') {
      // Check out
      event['type'] = 'check out';
      res = await this.passService.checkOutPass(
        orcId,
        pass['registrationNumber']
      );
    } else if (
      (pass.passStatus === 'active' || pass.passStatus === 'reserved') &&
      !pass.checkedIn
    ) {
      // Check in
      event['type'] = 'check in';
      res = await this.passService.checkInPass(
        orcId,
        pass['registrationNumber']
      );
    }
    event['result'] = res;
    this.logger.debug(JSON.stringify(res));
    this.updatePassList(res);
    pass.submitLoading = false;

    //TODO: Check in loop in case internet sucks
    //TODO: check in success noise
    //TODO: visual for successful check in
    this.event.emit(event);
  }

  updatePassList(pass) {
    let foundIndex = this.passes.findIndex(
      (x) => x.registrationNumber === pass.registrationNumber
    );
    this.passes[foundIndex] = this.processPass(pass);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
