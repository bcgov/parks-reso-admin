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
  ) { }
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
        dataTag = Constants.dataIds.CURRENT_FACILITY_KEY;
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
        if (!skipCache && res?.pk && res?.sk) {
          this.dataService.setItemValue(dataTag, { pk: res.pk, sk: res.sk });
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

  async putFacility(
    obj,
    parkSk,
    updateParkAndFacilityCache = false,
    updateCurrentParkCache = false
  ) {
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

        try {
          // ensure cache in DataService is updated with new park data.
          if (updateParkAndFacilityCache) {
            this.dataService.updateParkAndFacilityCache(res);
          }
          if (updateCurrentParkCache && res?.pk && res?.sk) {
            this.dataService.setItemValue(
              Constants.dataIds.CURRENT_FACILITY_KEY,
              { pk: res.pk, sk: res.sk }
            );
          }
        } catch (error) {
          this.toastService.addMessage(
            `Please refresh the page.`,
            `Error updating cache`,
            ToastTypes.ERROR
          );
        }

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

  async postFacility(
    obj,
    parkSk,
    updateParkAndFacilityCache = false
  ) {
    let errorSubject = '';
    let dataTag = 'facilityPost';
    try {
      errorSubject = 'facility post';
      if (this.validateFacilityObject(obj)) {
        this.loadingService.addToFetchList(dataTag);
        if (parkSk === '' || !parkSk) {
          throw 'Must provide a park.';
        }
        // Build the cachedObject for the front-end.
        const cachedObject = Object.assign({ pk: `facility::${parkSk}`, sk: obj.name }, obj);
        delete obj.pk;
        delete obj.sk;
        obj.parkOrcs = parkSk;
        this.loggerService.debug(`Post Facility: ${JSON.stringify(obj)}`);
        await firstValueFrom(this.apiService.post('facility', obj));
        // ensure cache in DataService is updated with new park data.
        try {
          if (updateParkAndFacilityCache) {
            this.dataService.updateParkAndFacilityCache(cachedObject);
          }
        } catch (error) {
          this.toastService.addMessage(
            `Please refresh the page.`,
            `Error updating cache`,
            ToastTypes.ERROR
          );
        }

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

  // Get current facility, key is stored in DataService.
  getCurrentFacility() {
    const key = this.dataService.getItemValue(Constants.dataIds.CURRENT_FACILITY_KEY);
    if (key) {
      return this.getCachedFacility(key);
    }
    return null;
  }

  // Get facility from cache using provided key.
  getCachedFacility(key) {
    const orcs = key?.pk.split('::')[1];
    return this.dataService.getItemValue(Constants.dataIds.PARK_AND_FACILITY_LIST)[orcs].facilities[key?.sk] || null;
  }
}
