import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { FacilityService } from '../services/facility.service';

@Injectable({
  providedIn: 'root',
})
export class FacilityResolver implements Resolve<void> {
  constructor(private facilityService: FacilityService) {}
  resolve(route: ActivatedRouteSnapshot) {
    if (route.params['parkId'] && route.params['facilityId']) {
      this.facilityService.fetchFacilities(
        route.params['parkId'],
        route.params['facilityId']
      );
    }
  }
}
