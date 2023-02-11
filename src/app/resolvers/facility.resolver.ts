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
export class FacilityResolver implements Resolve<void> {
  constructor(
    protected facilityService: FacilityService,
    protected passService: PassService,
    protected dataService: DataService,
    protected reservationService: ReservationService
  ) {}
  resolve(route: ActivatedRouteSnapshot) {
    const terminate = new Subject();
    this.dataService
      .watchItem(Constants.dataIds.PARK_AND_FACILITY_LIST)
      .pipe(takeUntil(terminate))
      .subscribe((res) => {
        if (res) {
          this.dataService.setItemValue(
            Constants.dataIds.CURRENT_FACILITY,
            res[route.params['parkId']].facilities[route.params['facilityId']]
          );
          terminate.next(null);
        }
      });
  }
}
