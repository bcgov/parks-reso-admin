import { Injectable } from '@angular/core';
import { ParkSubObject, PostPark, PutPark } from 'app/models/park';
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
    let res = null;
    try {
      // Remove non-valid fields and verify field types.
      console.log(obj);
      this.checkManditoryFields(obj);

      let postObj = new PostPark(obj);
      postObj.park = new ParkSubObject(obj);
      console.log(postObj);

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
    let res = null;
    try {
      this.checkManditoryFields(obj);
      if (!obj.pk) {
        throw ('You must provide a park pk');
      }
      if (!obj.sk) {
        throw ('You must provide a park sk');
      }
      let putObj = new PutPark(obj);
      putObj.park = new ParkSubObject(obj);
      // TODO: add facilities during a put or post
      putObj['facilities'] = [];
      res = await this.apiService.put('park', putObj);
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
      obj.status === '' ||
      !obj.status ||
      (obj.status !== 'closed' && obj.status !== 'open')
    ) {
      throw ('You must provide a valid park status');
    }
  }
}
