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
export class FacilityService {
  constructor(
    private dataService: DataService,
    private eventService: EventService,
    private toastService: ToastService,
    private apiService: ApiService,
    private loadingService: LoadingService
  ) {}
  public utils = new Utils();

  async fetchFacilities(parkSk = null, facilitySk = null) {
    let res;
    let errorSubject = '';
    let dataTag;
    try {
      errorSubject = 'facilities list';
      if (!facilitySk && parkSk) {
        dataTag = Constants.dataIds.FACILITIES_LIST;
        this.loadingService.addToFetchList(dataTag);
        // We are getting all facilities for a given park.
        res = await firstValueFrom(
          this.apiService.get('facility', { facilities: true, park: parkSk })
        );
        this.dataService.setItemValue(dataTag, res);
      } else if (facilitySk && parkSk) {
        // We are getting a single facility.
        dataTag = Constants.dataIds.CURRENT_FACILITY;
        this.loadingService.addToFetchList(dataTag);
        errorSubject = 'facility';
        res = await firstValueFrom(
          this.apiService.get('facility', {
            facilityName: facilitySk,
            park: parkSk,
          })
        );
        this.dataService.setItemValue(dataTag, res);
      } else {
        // We are getting all facilities
        dataTag = Constants.dataIds.FACILITIES_LIST;
        this.loadingService.addToFetchList(dataTag);
        errorSubject = 'facilities list';
        res = await firstValueFrom(this.apiService.get('facility'));
        this.dataService.setItemValue(dataTag, res);
      }
    } catch (e) {
      this.toastService.addMessage(
        `Please refresh the page.`,
        `Error getting ${errorSubject}`,
        ToastTypes.ERROR
      );
      this.eventService.setError(
        new EventObject(EventKeywords.ERROR, String(e), 'Facility Service')
      );
      // TODO: We may want to change this.
      if (errorSubject === 'facilities list')
        this.dataService.setItemValue(dataTag, 'error');
    }
    this.loadingService.removeToFetchList(dataTag);
  }
}
