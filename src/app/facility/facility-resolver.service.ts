import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { FacilityService } from 'app/services/facility.service';
import { PassService } from 'app/services/pass.service';

@Injectable()
export class FacilityResolverService implements Resolve<void> {
  constructor(
    private facilityService: FacilityService,
    private router: Router,
    private passService: PassService
  ) { }

  async resolve(route: ActivatedRouteSnapshot) {
    if (
      route.params &&
      route.params.facilityId &&
      route.parent &&
      route.parent.params &&
      route.parent.params.parkId
    ) {
      this.facilityService.clearItemValue();
      const facility = await this.facilityService.fetchData(route.params.facilityId, route.parent.params.parkId);
      this.passService.clearListValue();
      if (facility.bookingTimes.AM) {
        this.passService.fetchData(null, route.parent.params.parkId, route.params.facilityId, 'AM');
      } else if (facility.bookingTimes.PM) {
        this.passService.fetchData(null, route.parent.params.parkId, route.params.facilityId, 'PM');
      } else if (facility.bookingTimes.DAY) {
        this.passService.fetchData(null, route.parent.params.parkId, route.params.facilityId, 'DAY');
      }
      return facility;
    } else {
      this.router.navigate(['']);
    }
  }
}
