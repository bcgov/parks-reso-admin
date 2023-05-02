import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { DataService } from 'src/app/services/data.service';
import { FacilityService } from 'src/app/services/facility.service';
import { Constants } from 'src/app/shared/utils/constants';
import { Utils } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-pass-search',
  templateUrl: './pass-search.component.html',
  styleUrls: ['./pass-search.component.scss']
})
export class PassSearchComponent {
  private subscriptions = new Subscription();
  public facility;
  public Utils = new Utils();

  constructor(
    protected dataService: DataService,
    protected configService: ConfigService,
    protected facilityService: FacilityService
  ) {
    this.subscriptions.add(
      dataService
        .watchItem(Constants.dataIds.CURRENT_FACILITY_KEY)
        .subscribe((res) => {
          if (res) {
            this.facility = this.facilityService.getCachedFacility(res);
          }
        })
    );
  }

  get bookingOpeningHourText() {
    const facilityBookingOpeningHour = this.facility
      ? this.facility.bookingOpeningHour
      : null;
    const advanceBookingHour =
      facilityBookingOpeningHour ||
      parseInt(this.configService.config['ADVANCE_BOOKING_HOUR'], 10);
    const { hour, amPm } = this.Utils.convert24hTo12hTime(advanceBookingHour);

    if (hour && amPm) {
      return `${hour} ${amPm}`;
    }
    return '';
  }

  get bookingDaysAheadText() {
    let advanceBookingDays = this.facility
      ? this.facility.bookingDaysAhead
      : null;
    if (advanceBookingDays !== 0 && !advanceBookingDays) {
      advanceBookingDays = parseInt(
        this.configService.config['ADVANCE_BOOKING_LIMIT'],
        10
      );
    }

    if (advanceBookingDays === 0) {
      return 'Same Day';
    }
    if (advanceBookingDays === 1) {
      return '1 day';
    }

    return `${advanceBookingDays} days`;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
