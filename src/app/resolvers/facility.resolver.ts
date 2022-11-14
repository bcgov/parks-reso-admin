import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { FacilityService } from '../services/facility.service';

@Injectable({
  providedIn: 'root',
})
export class FacilityResolver implements Resolve<void> {
  constructor(protected facilityService: FacilityService) {}
  async resolve(route: ActivatedRouteSnapshot) {
    if (route.params['parkId'] && route.params['facilityId']) {
      await this.facilityService.fetchData(
        route.params['parkId'],
        route.params['facilityId']
      );
    }
  }
}
