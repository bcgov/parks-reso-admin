import { Injectable } from '@angular/core';
import { Facility } from 'app/models/facility';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { EventKeywords, EventObject, EventService } from './event.service';

@Injectable({
  providedIn: 'root'
})
export class FacilityService {
  private item: BehaviorSubject<any>;
  private list: BehaviorSubject<any>;

  constructor(
    private apiService: ApiService,
    private eventService: EventService
  ) {
    this.item = new BehaviorSubject(null);
    this.list = new BehaviorSubject(null);
  }

  setItemValue(value): void {
    this.item.next(value);
  }
  setListValue(value): void {
    this.list.next(value);
  }

  public getItemValue() {
    return this.item.asObservable();
  }
  public getListValue() {
    return this.list.asObservable();
  }

  async fetchData(facilitySk = null, parkSk = null) {
    let res = null;
    try {
      if (!facilitySk && parkSk) {
        // We are getting a facilities of a given park.
        res = await this.apiService.get('facility', { park: parkSk, facilities: true });
        this.setListValue(res);
      } else if (facilitySk && parkSk) {
        // we're getting a single item for a given park
        res = await this.apiService.get('facility', { facilityName: facilitySk, park: parkSk });
        res = res[0];
        this.setItemValue(res);
      } else {
        // We're getting a list
        res = await this.apiService.get('facility');
        this.setListValue(res);
      }
    } catch (e) {
      console.log('ERROR', e);
      this.eventService.setError(
        new EventObject(
          EventKeywords.ERROR,
          e,
          'Park Service'
        )
      );
    }
    return res;
  }

  clearItemValue(): void {
    this.setItemValue(null);
  }
  clearListValue(): void {
    this.setListValue(null);
  }

  async createFacility(obj, parkSk) {
    // Remove non-valid fields and verify field types.
    let postObj = new Facility(obj);

    // Remove ids
    delete postObj.pk;
    delete postObj.sk;

    let res = null;
    try {
      postObj['parkName'] = parkSk;
      this.checkManditoryFields(postObj);
      res = await this.apiService.post('facility', postObj);
    } catch (e) {
      console.log('ERROR', e);
      this.eventService.setError(
        new EventObject(
          EventKeywords.ERROR,
          e,
          'Park Service'
        )
      );
      throw e;
    }
    return res;
  }

  async editFacility(obj, parkSk) {
    // To do an edit we need to pass back the entire object with all old and new fields.
    let putObj = new Facility(obj);
    try {
      putObj['parkName'] = parkSk;
      this.checkManditoryFields(putObj);
      if (!putObj.pk) {
        throw ('You must provide a park pk');
      }
      if (!putObj.sk) {
        throw ('You must provide a park sk');
      }
      return await this.apiService.put('facility', putObj);
    } catch (e) {
      console.log('ERROR', e);
      this.eventService.setError(
        new EventObject(
          EventKeywords.ERROR,
          e,
          'Park Service'
        )
      );
      throw e;
    }
  }

  private checkManditoryFields(obj) {
    if (obj.name === '' || !obj.name) {
      throw ('You must provide a facility name');
    }
    if (obj.parkName === '' || !obj.parkName) {
      throw ('You must provide a park name');
    }
    if (
      typeof obj.visible !== 'boolean' ||
      obj.visible === null ||
      obj.visible === undefined) {
      throw ('You must provide a boolean for facility visibility');
    }
    if (
      obj.status.state === '' ||
      !obj.status.state ||
      (obj.status.state !== 'closed' && obj.status.state !== 'open')
    ) {
      throw ('You must provide a valid park status');
    }

    if (!obj.bookingTimes.AM && !obj.bookingTimes.PM && !obj.bookingTimes.DAY) {
      throw ('You must have a booking time set');
    }
  }
}
