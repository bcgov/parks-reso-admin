import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { ParkService } from '../services/park.service';

@Injectable({
  providedIn: 'root',
})
export class ParkResolver implements Resolve<void> {
  constructor(private parkService: ParkService) {}
  resolve(route: ActivatedRouteSnapshot) {
    if (route.params['parkId']) {
      this.parkService.fetchData(route.params['parkId']);
    }
  }
}
