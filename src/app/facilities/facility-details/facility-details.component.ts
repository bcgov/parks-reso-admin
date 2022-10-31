import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { PassService } from 'src/app/services/pass.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { Constants } from 'src/app/shared/utils/constants';
import { Utils } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-facility-details',
  templateUrl: './facility-details.component.html',
  styleUrls: ['./facility-details.component.scss'],
})
export class FacilityDetailsComponent implements OnDestroy {
  private subscriptions = new Subscription();
  public facility;
  public parkSk;
  public date;
  public passType;
  public resObject;
  private utils = new Utils();

  constructor(
    protected dataService: DataService,
    protected passService: PassService,
    protected reservationService: ReservationService
  ) {
    this.subscriptions.add(
      dataService
        .watchItem(Constants.dataIds.CURRENT_FACILITY)
        .subscribe((res) => {
          if (res && res[0]) {
            this.facility = res[0];
            // Check for passType and passDate
            // Otherwise the query could be uselessly enormous.
            let passObj = this.checkFilterParams(this.facility);
            this.parkSk = this.facility.pk.split('::')[1];
            passObj['parkSk'] = this.parkSk;
            passObj['facilitySk'] = this.facility.name;
            this.passService.fetchPasses(passObj);

            // Get reservation object
            this.reservationService.fetchReservations(
              this.parkSk,
              this.facility.name,
              this.date
            );
          }
        })
    );
    this.subscriptions.add(
      dataService
        .watchItem(Constants.dataIds.CURRENT_RESERVATIONS_OBJECT)
        .subscribe((res) => {
          this.resObject = res;
        })
    );
  }

  getBookingTimesList() {
    return Object.keys(this.facility.bookingTimes);
  }

  checkFilterParams(facility) {
    // Get existing filter params:
    let params = {};
    let filters =
      this.dataService.getItemValue(Constants.dataIds.PASS_SEARCH_PARAMS) ?? {};
    if (filters?.passDate && facility.sk === filters.facilitySk) {
      this.date = filters.passDate;
    } else {
      this.date = this.utils.getTodayAsShortDate();
    }
    params['date'] = this.date;
    if (filters?.passType && facility.sk === filters?.facilitySk) {
      this.passType = filters.passType;
    } else {
      this.passType = this.getBookingTimesList()[0];
    }
    params['passType'] = this.passType;
    return params;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
