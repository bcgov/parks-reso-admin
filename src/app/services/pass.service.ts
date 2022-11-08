import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
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
        // Check existing filter presets.
        let filters =
          this.dataService.getItemValue(Constants.dataIds.PASS_SEARCH_PARAMS) ??
          {};
        // Clear filters when switching facilities
        if (!this.checkFilters(filters, params)) {
          filters = {};
        }
        let queryObj = Object.assign(filters, params);
        (queryObj['park'] = params.parkSk),
          (queryObj['facilityName'] = params.facilitySk),
          (errorSubject = 'passes');
        if (params.ExclusiveStartKeyPK && params.ExclusiveStartKeySK) {
          // Load more.
          queryObj['ExclusiveStartKeyPK'] = params.ExclusiveStartKeyPK;
          queryObj['ExclusiveStartKeySK'] = params.ExclusiveStartKeySK;
        }
        res = await firstValueFrom(this.apiService.get('pass', queryObj));
        this.dataService.setItemValue(dataTag, res.data);
        this.dataService.setItemValue(
          Constants.dataIds.PASS_SEARCH_PARAMS,
          queryObj
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

  async updateSearchParams(filters, facility) {
    let filterMap = {
      date: filters.passDate || null,
      reservationNumber: filters.passReservationNumber || null,
      passStatus: filters.passStatus ? filters.passStatus.join(',') : null,
      firstName: filters.passFirstname || null,
      lastName: filters.passLastName || null,
      email: filters.passEmail || null,
      passType: filters.passType || null,
      facilitySk: facility.sk,
    };
    for (let item of Object.keys(filterMap)) {
      if (!filterMap[item]) {
        delete filterMap[item];
      }
    }
    this.dataService.setItemValue(
      Constants.dataIds.PASS_SEARCH_PARAMS,
      filterMap
    );
    return this.dataService.getItemValue(Constants.dataIds.PASS_SEARCH_PARAMS);
  }

  initializePassList(facility) {
    // TODO: We need to set params into the url
    // From here we can pull down these params and do our initial pass fetch.
    let params = {};

    // This is a placeholder. We would get these params from our url.
    let urlParams = {};
    params['date'] = urlParams['date']
      ? urlParams['date']
      : this.utils.getTodayAsShortDate();
    params['passType'] = urlParams['passType']
      ? urlParams['passType']
      : this.getBookingTimesList(facility)[0];

    this.dataService.setItemValue(Constants.dataIds.PASS_SEARCH_PARAMS, params);
    this.fetchData(params);
  }

  getBookingTimesList(facility) {
    return Object.keys(facility.bookingTimes);
  }
}
