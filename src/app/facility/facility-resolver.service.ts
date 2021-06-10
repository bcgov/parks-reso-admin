import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { FacilityService } from 'app/services/facility.service';

@Injectable()
export class FacilityResolverService implements Resolve<void> {
  constructor(
    private facilityService: FacilityService,
    private router: Router,
  ) { }

  resolve(route: ActivatedRouteSnapshot) {
    if (
      route.params &&
      route.params.facilityId &&
      route.parent &&
      route.parent.params &&
      route.parent.params.parkId
    ) {
      this.facilityService.clearItemValue();
      this.facilityService.fetchData(route.params.facilityId, route.parent.params.parkId);
    } else {
      this.router.navigate(['']);
    }
  }
}
