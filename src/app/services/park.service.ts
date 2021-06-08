import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { EventKeywords, EventObject, EventService } from './event.service';

@Injectable({
  providedIn: 'root'
})
export class ParkService {
  private data: BehaviorSubject<any>;
  public fetchDataConfig: any;

  constructor(
    private apiService: ApiService,
    private eventService: EventService
  ) {
    this.data = new BehaviorSubject(null);
  }

  setValue(value): void {
    this.data.next(value);
  }

  public getValue() {
    return this.data.asObservable();
  }

  async fetchData(sk = null) {
    let res = null;
    if (sk) {
      // we're getting a single item
    } else {
      // We're getting a list
      try {
        res = await this.apiService.getList('park').toPromise();
        // Deep copy
        res = JSON.parse(JSON.stringify(res));
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
    }
    this.setValue(res);
  }

  clearValue(): void {
    this.setValue(null);
  }
}
