import { Injectable } from '@angular/core';
import { first, forkJoin } from 'rxjs';
import { Constants } from '../shared/utils/constants';
import { ApiService } from './api.service';
import { DataService } from './data.service';
import { FacilityService } from './facility.service';
import { LoggerService } from './logger.service';
import { ParkService } from './park.service';

@Injectable({
  providedIn: 'root',
})
export class AutoFetchService {
  // TODO: This should come in from the config service.
  public timeIntevalSeconds = 5 * 60;
  public fetchQueue = [Constants.dataIds.PARK_AND_FACILITY_LIST];

  constructor(
    private parkService: ParkService,
    private facilityService: FacilityService,
    private dataService: DataService,
    private loggerService: LoggerService,
    private apiService: ApiService
  ) {}

  async run() {
    this.runFetches(this.fetchQueue);
    setInterval(() => {
      this.loggerService.debug(`RunFetches ${JSON.stringify(this.fetchQueue)}`);
      this.runFetches(this.fetchQueue);
    }, this.timeIntevalSeconds * 1000);
  }
  runFetches(fetchQueue) {
    // Only if we are online
    if (this.apiService.isNetworkOffline === false) {
      for (let i = 0; i < fetchQueue.length; i++) {
        const fetchId = fetchQueue[i];
        if (fetchId === Constants.dataIds.PARK_AND_FACILITY_LIST) {
          this.fetchParkAndFacility();
        }
      }
    }
  }

  async fetchParkAndFacility() {
    const parks = await this.parkService.fetchData(null, true);

    let observables: Array<Promise<any>> = [];
    for (let i = 0; i < parks?.length; i++) {
      observables.push(
        this.facilityService.fetchData(parks[i].sk, null, true).then((res) => {
          let facilityHash = {};
          for (let j = 0; j < res.length; j++) {
            facilityHash[res[j].sk] = res[j];
          }
          parks[i]['facilities'] = facilityHash;
          let parksHash = {};
          parksHash[parks[i].sk] = parks[i];
          return parksHash;
        })
      );
    }
    // Network failures can cause no observables.
    if (observables.length === 0) {
      return;
    }
    let parksObj = {};
    forkJoin(observables)
      .pipe(first())
      .subscribe((res) => {
        Object.assign(parksObj, ...res);
        this.dataService.setItemValue(
          Constants.dataIds.PARK_AND_FACILITY_LIST,
          parksObj
        );
      });
  }
}
