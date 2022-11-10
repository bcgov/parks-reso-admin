import { Injectable } from '@angular/core';
import { filter, firstValueFrom } from 'rxjs';
import { Constants } from '../shared/utils/constants';
import { Utils } from '../shared/utils/utils';
import { ApiService } from './api.service';
import { DataService } from './data.service';
import { EventKeywords, EventObject, EventService } from './event.service';
import { LoadingService } from './loading.service';
import { ToastService, ToastTypes } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class PassService {
  private utils = new Utils();

  constructor(
    private dataService: DataService,
    private eventService: EventService,
    private toastService: ToastService,
    private apiService: ApiService,
    private loadingService: LoadingService
  ) {}

  // params = {
  // passSk:,
  // parkSk:,
  // facilitySk:,
  // passType:,
  // ExclusiveStartKeyPK:,
  // ExclusiveStartKeySK:,
  // queryParams:
  // }
  async fetchData(params) {
    let res;
    let errorSubject = '';
    let dataTag;
    try {
      if (
        !params.passSk &&
        params.parkSk &&
        params.facilitySk &&
        params.passType
      ) {
        dataTag = Constants.dataIds.PASSES_LIST;
        this.loadingService.addToFetchList(dataTag);

        // TODO: clean up param magic.
        (params['park'] = params.parkSk),
          (params['facilityName'] = params.facilitySk),
          (errorSubject = 'passes');
        if (params.ExclusiveStartKeyPK && params.ExclusiveStartKeySK) {
          // Load more.
          params['ExclusiveStartKeyPK'] = params.ExclusiveStartKeyPK;
          params['ExclusiveStartKeySK'] = params.ExclusiveStartKeySK;
        }

        res = await firstValueFrom(this.apiService.get('pass', params));
        this.dataService.setItemValue(dataTag, res.data);
        this.dataService.setItemValue(
          Constants.dataIds.PASS_SEARCH_PARAMS,
          params
        );
      }
    } catch (e) {
      this.toastService.addMessage(
        `Please refresh the page.`,
        `Error getting ${errorSubject}`,
        ToastTypes.ERROR
      );
      this.eventService.setError(
        new EventObject(EventKeywords.ERROR, String(e), 'Pass Service')
      );
      // TODO: We may want to change this.
      if (errorSubject === 'pass list')
        this.dataService.setItemValue(dataTag, 'error');
    }
    this.loadingService.removeToFetchList(dataTag);
    return res;
  }

  async cancelPasses(passId, parkSk) {
    let res;
    let errorSubject = 'pass';
    let dataTag = Constants.dataIds.CANCELLED_PASS;
    try {
      this.loadingService.addToFetchList(dataTag);
      res = await firstValueFrom(
        this.apiService.delete('pass', { passId: passId, park: parkSk })
      );
      this.dataService.setItemValue(dataTag, res);
      const params = this.dataService.getItemValue(
        Constants.dataIds.PASS_SEARCH_PARAMS
      );
      this.fetchData(params);
    } catch (e) {
      this.toastService.addMessage(
        `Please refresh the page.`,
        `Error cancelling ${errorSubject}`,
        ToastTypes.ERROR
      );
      this.eventService.setError(
        new EventObject(EventKeywords.ERROR, String(e), 'Pass Service')
      );
      // TODO: We may want to change this.
      if (errorSubject === 'pass cancel')
        this.dataService.setItemValue(dataTag, 'error');
    }
    this.loadingService.removeToFetchList(dataTag);
  }

  checkFilters(filters, params) {
    if (filters.facilitySk !== params.facilitySk) {
      return false;
    }
    return true;
  }

  filterSearchParams(params) {
    let filterMap = {
      date: params.date || null,
      reservationNumber: params.reservationNumber || null,
      passStatus: params.passStatus ? params.passStatus.split(',') : null,
      firstName: params.firstName || null,
      lastName: params.lastName || null,
      email: params.email || null,
      passType: params.passType || null,
    };
    for (let item of Object.keys(filterMap)) {
      if (!filterMap[item]) {
        delete filterMap[item];
      }
    }
    return filterMap;
  }

  initializePassList(facility, queryParams = {}) {
    let defaultParams = {};
    if (Object.keys(queryParams).length === 0) {
      defaultParams = this.setPassParamDefaults(queryParams, facility);
    }
    const filterMap = this.filterSearchParams(queryParams);
    const params = Object.assign(filterMap, defaultParams);
    params['parkSk'] = facility.pk.split('::')[1];
    params['facilitySk'] = facility.sk;
    this.fetchData(params);
  }

  setPassParamDefaults(filterMap, facility) {
    let params = {};
    params['date'] = filterMap['date'] ?? this.utils.getTodayAsShortDate();
    params['passType'] =
      filterMap['passType'] ?? this.getBookingTimesList(facility)[0];

    return params;
  }

  getBookingTimesList(facility) {
    return Object.keys(facility.bookingTimes);
  }
}
