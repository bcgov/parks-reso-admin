import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Constants } from '../shared/utils/constants';
import { ApiService } from './api.service';
import { DataService } from './data.service';
import { EventKeywords, EventObject, EventService } from './event.service';
import { LoadingService } from './loading.service';
import { ToastService, ToastTypes } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class PassService {
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

  async fetchPasses(params) {
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
        // We are getting a list of passes filtered by type.
        errorSubject = 'passes';
        let queryObj = {
          park: params.parkSk,
          facilityName: params.facilitySk,
          passType: params.passType,
        };
        if (params.ExclusiveStartKeyPK && params.ExclusiveStartKeySK) {
          // Load more.
          queryObj['ExclusiveStartKeyPK'] = params.ExclusiveStartKeyPK;
          queryObj['ExclusiveStartKeySK'] = params.ExclusiveStartKeySK;
        }
        if (params.queryParams) {
          // append queryParams to queryObj.
          Object.keys(params.queryParams).forEach((key) => {
            queryObj[key] = params.queryParams[key];
          });
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
      this.fetchPasses(params);
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
}
