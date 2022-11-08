import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { PassService } from 'src/app/services/pass.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { Constants } from 'src/app/shared/utils/constants';

@Component({
  selector: 'app-facility-details',
  templateUrl: './facility-details.component.html',
  styleUrls: ['./facility-details.component.scss'],
})
export class FacilityDetailsComponent implements OnDestroy {
  private subscriptions = new Subscription();
  public facility;

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
            // TODO: This is where we should get initial pass list
            // The reason why this is not in a separate pass resolver is because we require bookingtimes from our selected facility.
            // Facility is only accessible after the facility resolver has resolved.
            passService.initializePassList(this.facility);
            let passFilterParams = this.dataService.getItemValue(
              Constants.dataIds.PASS_SEARCH_PARAMS
            );

            // Initialize reservation data
            this.reservationService.fetchData(
              this.facility.pk.split('::')[1],
              this.facility.name,
              passFilterParams['date'],
              passFilterParams['passType']
            );
          }
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
