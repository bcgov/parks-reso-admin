import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { PassService } from 'src/app/services/pass.service';
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
  private utils = new Utils();

  constructor(
    protected dataService: DataService,
    protected passService: PassService
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
            passObj['parkSk'] = this.facility.pk.split('::')[1];
            passObj['facilitySk'] = this.facility.name;
            this.passService.fetchPasses(passObj);
          }
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
      params['date'] = filters.passDate;
    } else {
      params['date'] = this.utils.getTodayAsShortDate();
    }
    if (filters?.passType && facility.sk === filters?.facilitySk) {
      params['passType'] = filters.passType;
    } else {
      params['passType'] = this.getBookingTimesList()[0];
    }
    return params;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
