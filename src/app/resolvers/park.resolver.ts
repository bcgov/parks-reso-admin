import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { FacilityService } from '../services/facility.service';
import { ParkService } from '../services/park.service';

@Injectable({
  providedIn: 'root',
})
export class ParkResolver implements Resolve<void> {
  constructor(
    private parkService: ParkService,
  ) {}
  resolve(route: ActivatedRouteSnapshot) {
    if (route.params['parkId']) {
      this.parkService.fetchParks(route.params['parkId']);
    }
  }
}
