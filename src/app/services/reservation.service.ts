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
export class ReservationService {
  constructor(
    private dataService: DataService,
    private eventService: EventService,
    private toastService: ToastService,
    private apiService: ApiService,
    private loadingService: LoadingService
  ) {}

  async fetchData(parkSk, facilitySk, resDate = null) {
    let res;
    let errorSubject = '';
    let dataTag;
    try {
      if (resDate) {
        // We are getting a single reservations object.
        dataTag = Constants.dataIds.CURRENT_RESERVATIONS_OBJECT;
        this.loadingService.addToFetchList(dataTag);
        errorSubject = 'facility reservation';
        res = await firstValueFrom(
          this.apiService.get('reservation', {park: parkSk, facility: facilitySk, date: resDate})
          );
        } else {
          // We are getting a list of reservation objects.
          dataTag = Constants.dataIds.RESERVATION_OBJECTS_LIST;
          this.loadingService.addToFetchList(dataTag);
          errorSubject = 'facility reservations list';
          res = await firstValueFrom(
            this.apiService.get('reservation', {park: parkSk, facility: facilitySk})
            );
        }
        this.dataService.setItemValue(dataTag, res);
    } catch (e) {
      this.toastService.addMessage(
        `Please refresh the page.`,
        `Error getting ${errorSubject}`,
        ToastTypes.ERROR
      );
      this.eventService.setError(
        new EventObject(EventKeywords.ERROR, String(e), 'Reservation Service')
      );
      // TODO: We may want to change this.
      if (errorSubject === 'facility reservations')
        this.dataService.setItemValue(dataTag, 'error');
    }
    this.loadingService.removeToFetchList(dataTag);
  }
}
