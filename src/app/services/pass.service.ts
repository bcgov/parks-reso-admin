import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { EventKeywords, EventObject, EventService } from './event.service';

@Injectable({
  providedIn: 'root'
})
export class PassService {
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

  async fetchData(passSk = null, parkSk = null, facilitySk = null, passType = null) {
    let res = null;
    try {
      if (!passSk && parkSk && facilitySk && passType) {
        // We are getting list of passes filtered with type
        res = await this.apiService.get(
          'pass',
          {
            park: parkSk,
            facilityName: facilitySk,
            passType: passType
          }
        );
        this.setListValue(res);
      }
    } catch (e) {
      console.log('ERROR', e);
      this.eventService.setError(
        new EventObject(
          EventKeywords.ERROR,
          e,
          'Pass Service'
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

  async cancelPass(passId, parkSk) {
    let res = null;
    try {
      res = await this.apiService.delete('pass', { passName: passId, park: parkSk });
      this.setItemValue(res);
    } catch (e) {
      console.log('ERROR', e);
      this.eventService.setError(
        new EventObject(
          EventKeywords.ERROR,
          e,
          'Pass Service'
        )
      );
    }
  }
}
