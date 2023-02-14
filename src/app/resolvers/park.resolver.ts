import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DataService } from '../services/data.service';
import { Constants } from '../shared/utils/constants';

@Injectable({
  providedIn: 'root',
})
export class ParkResolver implements Resolve<void> {
  constructor(protected dataService: DataService) {}
  resolve(route: ActivatedRouteSnapshot) {
    const terminate = new Subject();
    this.dataService
      .watchItem(Constants.dataIds.PARK_AND_FACILITY_LIST)
      .pipe(takeUntil(terminate))
      .subscribe((res) => {
        if (res) {
          this.dataService.setItemValue(
            Constants.dataIds.CURRENT_PARK,
            res[route.params['parkId']]
          );
          this.dataService.setItemValue(
            Constants.dataIds.FACILITIES_LIST,
            Object.values(res[route.params['parkId']].facilities)
          );
          terminate.next(null);
        }
      });
  }
}
