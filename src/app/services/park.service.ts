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

  async fetchParksList() {
    this.loadingService.addToFetchList(Constants.dataIds.PARKS_LIST);
    let res;
    let errorSubject = '';
    try {
      errorSubject = 'parks list';
      res = await firstValueFrom(this.apiService.get('park'));
      this.dataService.setItemValue(Constants.dataIds.PARKS_LIST, res);
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
      this.dataService.setItemValue(Constants.dataIds.PARKS_LIST, 'error');
    }
    this.loadingService.removeToFetchList(Constants.dataIds.PARKS_LIST);
  }
}
