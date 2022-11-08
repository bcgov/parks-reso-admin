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
export class ParkService {
  constructor(
    private dataService: DataService,
    private eventService: EventService,
    private toastService: ToastService,
    private apiService: ApiService,
    private loadingService: LoadingService
  ) {}
  public utils = new Utils();

  // Get all parks
  async fetchData(sk = null) {
    let dataTag = '';
    let res;
    let errorSubject = '';
    try {
      if (sk) {
        // we are getting a single park based on sk
        dataTag = Constants.dataIds.CURRENT_PARK;
        this.loadingService.addToFetchList(dataTag);
        errorSubject = 'park';
        res = await firstValueFrom(this.apiService.get('park', { park: sk }));
      } else {
        // we are getting all parks
        dataTag = Constants.dataIds.PARKS_LIST;
        this.loadingService.addToFetchList(dataTag);
        errorSubject = 'parks list';
        res = await firstValueFrom(this.apiService.get('park'));
      }
      this.dataService.setItemValue(dataTag, res);
    } catch (e) {
      this.toastService.addMessage(
        `Please refresh the page.`,
        `Error getting ${errorSubject}`,
        ToastTypes.ERROR
      );
      this.eventService.setError(
        new EventObject(EventKeywords.ERROR, String(e), 'Park Service')
      );
      // TODO: We may want to change this.
      this.dataService.setItemValue(dataTag, 'error');
    }
    this.loadingService.removeToFetchList(dataTag);
    return res;
  }
}
