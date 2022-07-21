import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { FacilityService } from 'app/services/facility.service';
import { PassService } from 'app/services/pass.service';
import { ReservationService } from 'app/services/reservation.service';
import { DateTime } from 'luxon';

@Injectable()
export class FacilityResolverService implements Resolve<void> {
  constructor(
    private facilityService: FacilityService,
    private router: Router,
    private passService: PassService,
    private reservationService: ReservationService
  ) {}

  async resolve(route: ActivatedRouteSnapshot) {
    const today = DateTime.now().setZone('America/Vancouver').toISODate();
    if (route.params && route.params.facilityId && route.parent && route.parent.params && route.parent.params.parkId) {
      this.facilityService.clearItemValue();
      const facility = await this.facilityService.fetchData(route.params.facilityId, route.parent.params.parkId);
      this.passService.clearListValue();
      if (facility.bookingTimes.AM) {
        this.passService.fetchData(null, route.parent.params.parkId, route.params.facilityId, 'AM', null, null, {
          date: today
        });
      } else if (facility.bookingTimes.PM) {
        this.passService.fetchData(null, route.parent.params.parkId, route.params.facilityId, 'PM', null, null, {
          date: today
        });
      } else if (facility.bookingTimes.DAY) {
        this.passService.fetchData(null, route.parent.params.parkId, route.params.facilityId, 'DAY', null, null, {
          date: today
        });
      }

      // Fetch reservations object
      this.reservationService.fetchData(route.parent.params.parkId, route.params.facilityId, today);

      return facility;
    } else {
      this.router.navigate(['']);
    }
  }
}
