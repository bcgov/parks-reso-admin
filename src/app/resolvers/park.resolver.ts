import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DataService } from '../services/data.service';
import { Constants } from '../shared/utils/constants';

@Injectable({
  providedIn: 'root',
})
export class ParkResolver  {
  constructor(protected dataService: DataService) { }
  resolve(route: ActivatedRouteSnapshot) {
    const terminate = new Subject();
    this.dataService
      .watchItem(Constants.dataIds.PARK_AND_FACILITY_LIST)
      .pipe(takeUntil(terminate))
      .subscribe((res) => {
        if (res) {
          this.dataService.setItemValue(
            Constants.dataIds.CURRENT_PARK_KEY,
            { pk: 'park', sk: route.params['parkId']}
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
