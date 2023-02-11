import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
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
    const terminate = new Subject();
    this.dataService
      .watchItem(Constants.dataIds.CURRENT_FACILITY)
      .pipe(takeUntil(terminate))
      .subscribe(async (res) => {
        if (res) {
          const facility = res;
          if (facility) {
            const filteredParams = await this.passService.setParamsFromUrl(
              facility,
              route.queryParams
            );

            // Initialize reservation data
            this.reservationService.fetchData(
              filteredParams['park'],
              filteredParams['facilityName'],
              filteredParams['date'],
              filteredParams['passType']
            );
          } else {
            // TODO: Handle the error
          }
          terminate.next(null);
        }
      });
  }
}
