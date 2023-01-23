import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Constants } from '../shared/utils/constants';
import { Utils } from '../shared/utils/utils';
import { ApiService } from './api.service';
import { DataService } from './data.service';
import { EventKeywords, EventObject, EventService } from './event.service';
import { LoadingService } from './loading.service';
import { LoggerService } from './logger.service';
import { ToastService, ToastTypes } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class PassService {
  private utils = new Utils();

  constructor(
    private dataService: DataService,
    private eventService: EventService,
    private loggerService: LoggerService,
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
  // appendResults: boolean,
  // queryParams:
  // }
  async fetchData(params) {
    let res;
    let errorSubject = '';
    let dataTag;
    try {
      if (params.park && params.passId) {
        console.log('PARK', params.park);
        console.log('passId', params.passId);

        // Fetch for QR codes
        // For now we are going to async this.

        // This might be useful for online later
        dataTag = 'get-' + params.passId;
        this.loadingService.addToFetchList(dataTag);
        const queryParams = this.filterSearchParams(params);
        res = await firstValueFrom(this.apiService.get('pass', queryParams));
        this.dataService.setItemValue(dataTag, res.data[0]);
        this.loadingService.removeToFetchList(dataTag);
        return res.data[0];
      } else if (
        !params.passSk &&
        params.park &&
        params.facilityName &&
        params.passType
      ) {
        dataTag = Constants.dataIds.PASSES_LIST;
        this.loadingService.addToFetchList(dataTag);
        const queryParams = this.filterSearchParams(params);
        res = await firstValueFrom(this.apiService.get('pass', queryParams));
        if (params?.appendResults) {
          this.dataService.appendItemValue(dataTag, res.data);
        } else {
          this.dataService.setItemValue(dataTag, res.data);
        }
        if (res.LastEvaluatedKey) {
          this.dataService.setItemValue(
            Constants.dataIds.PASS_LAST_EVALUATED_KEY,
            res.LastEvaluatedKey
          );
        } else {
          this.dataService.clearItemValue(
            Constants.dataIds.PASS_LAST_EVALUATED_KEY
          );
        }
        this.dataService.setItemValue(
          Constants.dataIds.PASS_SEARCH_PARAMS,
          queryParams
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
      this.loggerService.debug(`Pass DELETE ${passId} ${parkSk}`);
      res = await firstValueFrom(
        this.apiService.delete('pass', { passId: passId, park: parkSk })
      );
      this.dataService.setItemValue(dataTag, res);
      const params = this.dataService.getItemValue(
        Constants.dataIds.PASS_SEARCH_PARAMS
      );
      this.fetchData(params);
    } catch (e) {
      this.loggerService.error(`${JSON.stringify(e)}`);
      this.toastService.addMessage(
        `Please refresh the page.`,
        `Error cancelling ${errorSubject}`,
        ToastTypes.ERROR
      );
      this.eventService.setError(
        new EventObject(EventKeywords.ERROR, String(e), 'Pass Service')
      );
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
      park: params.park || null,
      facilityName: params.facilityName || null,
      date: params.date || null,
      reservationNumber: params.reservationNumber || null,
      passId: params.passId || null,
      passStatus: params.passStatus || null,
      firstName: params.firstName || null,
      lastName: params.lastName || null,
      email: params.email || null,
      passType: params.passType || null,
      overbooked: params.overbooked || null,
      ExclusiveStartKeyPK: params.ExclusiveStartKeyPK || null,
      ExclusiveStartKeySK: params.ExclusiveStartKeySK || null,
    };

    for (let item of Object.keys(filterMap)) {
      if (!filterMap[item]) {
        delete filterMap[item];
      }
    }
    return filterMap;
  }

  setParamsFromUrl(facility, queryParams = {}) {
    let params = { ...queryParams };
    params['park'] = facility.pk.split('::')[1];
    params['facilityName'] = facility.name;

    if (Object.keys(queryParams).length === 0) {
      // No params in url. Set defaults
      params['date'] = this.utils.getTodayAsShortDate();
      params['passType'] = this.getBookingTimesList(facility)[0];
      params['overbooked'] = 'all';
    } else {
      // QueryParams need passStatus as an array.
      if (queryParams['passStatus']) {
        params['passStatus'] = queryParams['passStatus'].split(',');
      }
    }
    this.fetchData(params);
    return params;
  }

  getBookingTimesList(facility) {
    return Object.keys(facility.bookingTimes);
  }

  async checkInPass(pk, sk) {
    if (pk && sk) {
      const res = await firstValueFrom(
        await this.apiService.put(
          'pass',
          { pk: pk, sk: sk },
          { checkedIn: true }
        )
      );
      this.toastService.addMessage(
        `Pass successfully checked-in.`,
        'QR Service',
        Constants.ToastTypes.SUCCESS
      );
      return res;
    }
    return null;
  }
  async checkOutPass(pk, sk) {
    if (pk && sk) {
      const res = await firstValueFrom(
        await this.apiService.put(
          'pass',
          { pk: pk, sk: sk },
          { checkedIn: false }
        )
      );
      this.toastService.addMessage(
        `Pass successfully checked-out.`,
        'QR Service',
        Constants.ToastTypes.SUCCESS
      );
      return res;
    }
    return null;
  }
}
