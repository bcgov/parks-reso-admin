import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { DataService } from '../services/data.service';
import { FacilityService } from '../services/facility.service';
import { PassService } from '../services/pass.service';
import { ReservationService } from '../services/reservation.service';
import { Constants } from '../shared/utils/constants';

@Injectable({
  providedIn: 'root',
})
export class FacilityDetailsResolver implements Resolve<void> {
  constructor(
    protected facilityService: FacilityService,
    protected passService: PassService,
    protected dataService: DataService,
    protected reservationService: ReservationService
  ) {}
  async resolve(route: ActivatedRouteSnapshot) {
    const facility = this.dataService.getItemValue(
      Constants.dataIds.CURRENT_FACILITY
    )[0];

    if (facility) {
      // TODO: This is where we should get initial pass list
      // The reason why this is not in a separate pass resolver is because we require bookingtimes from our selected facility.
      // Facility is only accessible after the facility resolver has resolved.
      await this.passService.initializePassList(facility, route.queryParams);
      const passFilterParams = this.dataService.getItemValue(
        Constants.dataIds.PASS_SEARCH_PARAMS
      );

      // Initialize reservation data
      this.reservationService.fetchData(
        facility.pk.split('::')[1],
        facility.name,
        passFilterParams['date'],
        passFilterParams['passType']
      );
    } else {
      // TODO: Handle the error
    }
  }
}
