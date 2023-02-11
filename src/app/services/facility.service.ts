import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Constants } from '../shared/utils/constants';
import { Utils } from '../shared/utils/utils';
import { ApiService } from './api.service';
import { DataService } from './data.service';
import { EventKeywords, EventObject, EventService } from './event.service';
import { LoadingService } from './loading.service';
import { ToastService, ToastTypes } from './toast.service';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root',
})
export class FacilityService {
  constructor(
    private dataService: DataService,
    private eventService: EventService,
    private toastService: ToastService,
    private loggerService: LoggerService,
    private apiService: ApiService,
    private loadingService: LoadingService
  ) {}
  public utils = new Utils();

  async fetchData(parkSk = null, facilitySk = null, skipCache = false) {
    let res;
    let errorSubject = '';
    let dataTag;
    try {
      errorSubject = 'facilities list';
      if (!facilitySk && parkSk) {
        dataTag = Constants.dataIds.FACILITIES_LIST;
        this.loadingService.addToFetchList(dataTag);
        // We are getting all facilities for a given park.
        this.loggerService.debug(`Facility GET: ${parkSk}`);
        res = await firstValueFrom(
          this.apiService.get('facility', { facilities: true, park: parkSk })
        );
        this.dataService.setItemValue(dataTag, res);
      } else if (facilitySk && parkSk) {
        // We are getting a single facility.
        dataTag = Constants.dataIds.CURRENT_FACILITY;
        this.loadingService.addToFetchList(dataTag);
        errorSubject = 'facility';
        this.loggerService.debug(`Facility GET: ${parkSk} ${facilitySk}`);
        res = (
          await firstValueFrom(
            this.apiService.get('facility', {
              facilityName: facilitySk,
              park: parkSk,
            })
          )
        )[0];
        if (!skipCache) {
          this.dataService.setItemValue(dataTag, res);
        }
      }
    } catch (e) {
      this.loggerService.error(`${JSON.stringify(e)}`);
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
        if (!skipCache) {
          this.dataService.setItemValue(dataTag, 'error');
        }
    }
    this.loadingService.removeToFetchList(dataTag);
    return res;
  }

  async putFacility(obj, parkSk) {
    let res;
    let errorSubject = '';
    let dataTag = 'facilityPut';
    try {
      errorSubject = 'facility put';
      if (this.validateFacilityObject(obj)) {
        this.loadingService.addToFetchList(dataTag);
        if (parkSk === '' || !parkSk) {
          throw 'Must provide a park.';
        }
        (obj.pk = `facility::${parkSk}`),
          (obj.sk = obj.name),
          (obj.parkOrcs = parkSk);
        this.loggerService.debug(`Put Facility: ${JSON.stringify(obj)}`);
        res = await firstValueFrom(this.apiService.put('facility', obj));
        // ensure CURRENT_FACILITY in DataService is updated with new facility data.
        this.fetchData(parkSk, obj.name);
        this.fetchData(parkSk);
        this.toastService.addMessage(
          `Facility: ${parkSk} - ${obj.name} updated.`,
          `Facility updated`,
          ToastTypes.SUCCESS
        );
      }
    } catch (e) {
      this.loggerService.error(`Put Facility: ${JSON.stringify(e)}`);
      this.toastService.addMessage(
        `There was a problem updating the facility.`,
        `Error putting ${errorSubject}`,
        ToastTypes.ERROR
      );
      this.eventService.setError(
        new EventObject(EventKeywords.ERROR, String(e), 'Facility Service')
      );
    }
    this.loadingService.removeToFetchList(dataTag);
  }

  async postFacility(obj, parkSk) {
    let res;
    let errorSubject = '';
    let dataTag = 'facilityPost';
    try {
      errorSubject = 'facility post';
      if (this.validateFacilityObject(obj)) {
        this.loadingService.addToFetchList(dataTag);
        if (parkSk === '' || !parkSk) {
          throw 'Must provide a park.';
        }
        delete obj.pk;
        delete obj.sk;
        obj.parkOrcs = parkSk;
        this.loggerService.debug(`Post Facility: ${JSON.stringify(obj)}`);
        res = await firstValueFrom(this.apiService.post('facility', obj));
        // ensure CURRENT_FACILITY in DataService is updated with new facility data.
        this.fetchData(parkSk, obj.name);
        this.fetchData(parkSk);
        this.toastService.addMessage(
          `New facility ${parkSk} - ${obj.name} created.`,
          `New Facility created`,
          ToastTypes.SUCCESS
        );
      }
    } catch (e) {
      this.loggerService.error(`Post Facility: ${JSON.stringify(e)}`);
      this.toastService.addMessage(
        `There was a problem creating the facility.`,
        `Error posting ${errorSubject}`,
        ToastTypes.ERROR
      );
      this.eventService.setError(
        new EventObject(EventKeywords.ERROR, String(e), 'Facility Service')
      );
    }
    this.loadingService.removeToFetchList(dataTag);
  }

  validateFacilityObject(obj) {
    // TODO: write this function
    return true;
  }
}
