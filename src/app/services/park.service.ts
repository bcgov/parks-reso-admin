import { Injectable } from '@angular/core';
import { Park } from 'app/models/park';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { EventKeywords, EventObject, EventService } from './event.service';

@Injectable({
  providedIn: 'root'
})
export class ParkService {
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

  async fetchData(sk = null) {
    let res = null;
    try {
      if (sk) {
        // we're getting a single item
        res = await this.apiService.get('park', { park: sk });
        res = res[0];
        // TODO: checks before sending back item.
        this.setItemValue(res);

      } else {
        // We're getting a list
        res = await this.apiService.get('park');
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

  async createPark(obj) {
    // Remove non-valid fields and verify field types.
    let postObj = new Park(obj);

    // Remove ids
    delete postObj.pk;
    delete postObj.sk;

    let res = null;
    try {
      this.checkManditoryFields(postObj);
      this.createParkSubObject(postObj);
      postObj['facilities'] = [];
      res = await this.apiService.post('park', postObj);
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

  async editPark(obj) {
    // To do an edit we need to pass back the entire object with all old and new fields.
    let putObj = new Park(obj);
    try {
      this.checkManditoryFields(putObj);
      if (!putObj.pk) {
        throw ('You must provide a park pk');
      }
      if (!putObj.sk) {
        throw ('You must provide a park sk');
      }
      this.createParkSubObject(putObj);
      // TODO: add facilities during a put or post
      putObj['facilities'] = [];
      return await this.apiService.put('park', putObj);
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

  private createParkSubObject(obj) {
    obj['park'] = {
      name: obj.name,
      bcParksLink: obj.bcParksLink,
      status: obj.status,
      capacity: obj.capacity
    };
    delete obj.name;
    delete obj.bcParksLink;
    delete obj.status;
    delete obj.capacity;
  }

  private checkManditoryFields(obj) {
    if (obj.name === '' || !obj.name) {
      throw ('You must provide a park name');
    }
    if (obj.description === '' || !obj.description) {
      throw ('You must provide a park description');
    }
    if (
      typeof obj.visible !== 'boolean' ||
      obj.visible === null ||
      obj.visible === undefined
    ) {
      throw ('You must provide a boolean for park visibility');
    }
    if (
      obj.status.state === '' ||
      !obj.status.state ||
      (obj.status.state !== 'closed' && obj.status.state !== 'open')
    ) {
      throw ('You must provide a valid park status');
    }
  }
}
