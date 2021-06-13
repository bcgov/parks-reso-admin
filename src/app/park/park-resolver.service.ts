import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { FacilityService } from 'app/services/facility.service';
import { ParkService } from 'app/services/park.service';

@Injectable()
export class ParkResolverService implements Resolve<void> {
  constructor(
    private parkService: ParkService,
    private facilityService: FacilityService,
    private router: Router
  ) { }

  async resolve(route: ActivatedRouteSnapshot) {
    if (route.params && route.params.parkId) {
      this.facilityService.clearListValue();
      this.facilityService.fetchData(null, route.params.parkId);

      this.parkService.clearItemValue();
      return await this.parkService.fetchData(route.params.parkId);
    } else {
      this.router.navigate(['']);
    }
  }
}
