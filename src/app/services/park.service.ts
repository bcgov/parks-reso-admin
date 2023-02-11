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
export class ParkService {
  constructor(
    private dataService: DataService,
    private eventService: EventService,
    private toastService: ToastService,
    private loggerService: LoggerService,
    private apiService: ApiService,
    private loadingService: LoadingService
  ) {}
  public utils = new Utils();

  // Get all parks
  async fetchData(sk = null, skipCache = false) {
    let dataTag = '';
    let res;
    let errorSubject = '';
    try {
      if (sk) {
        // we are getting a single park based on sk
        dataTag = Constants.dataIds.CURRENT_PARK;
        this.loadingService.addToFetchList(dataTag);
        errorSubject = 'park';
        this.loggerService.debug(`Park GET ${sk}`);
        res = (
          await firstValueFrom(this.apiService.get('park', { park: sk }))
        )[0];
        console.log('????', res);
      } else {
        // we are getting all parks
        dataTag = Constants.dataIds.PARKS_LIST;
        this.loadingService.addToFetchList(dataTag);
        errorSubject = 'parks list';
        this.loggerService.debug(`Park List GET`);
        res = await firstValueFrom(this.apiService.get('park'));
      }
      if (!skipCache) {
        this.dataService.setItemValue(dataTag, res);
      }
    } catch (e) {
      this.loggerService.error(`${JSON.stringify(e)}`);
      this.toastService.addMessage(
        `Please refresh the page.`,
        `Error getting ${errorSubject}`,
        ToastTypes.ERROR
      );
      this.eventService.setError(
        new EventObject(EventKeywords.ERROR, String(e), 'Park Service')
      );
      // TODO: We may want to change this.
      if (!skipCache) {
        this.dataService.setItemValue(dataTag, 'error');
      }
    }
    this.loadingService.removeToFetchList(dataTag);
    return res;
  }

  async putPark(obj) {
    let res;
    let errorSubject = '';
    let dataTag = 'parkPut';
    try {
      errorSubject = 'park put';
      if (this.validateParkObject(obj)) {
        this.loadingService.addToFetchList(dataTag);
        obj.pk = 'park';
        obj.sk = obj.park.orcs;
        this.loggerService.debug(`Park GET ${JSON.stringify(obj)}`);
        res = await firstValueFrom(this.apiService.put('park', obj));
        // ensure CURRENT_PARK in DataService is updated with new facility data.
        this.fetchData(obj.sk);
        this.toastService.addMessage(
          `Park: ${obj.sk} updated.`,
          `Park updated`,
          ToastTypes.SUCCESS
        );
      }
    } catch (e) {
      this.loggerService.error(`${JSON.stringify(e)}`);
      this.toastService.addMessage(
        `There was a problem updating the park.`,
        `Error putting ${errorSubject}`,
        ToastTypes.ERROR
      );
      this.eventService.setError(
        new EventObject(EventKeywords.ERROR, String(e), 'Park Service')
      );
    }
    this.loadingService.removeToFetchList(dataTag);
  }

  validateParkObject(obj) {
    // TODO: write this function
    return true;
  }
}
