import { Injectable } from '@angular/core';
import { Constants } from 'app/shared/utils/constants';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { EventKeywords, EventObject, EventService } from './event.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class RescountService {
  private item: BehaviorSubject<any>;
  constructor(private apiService: ApiService, private eventService: EventService, private toastService: ToastService) {
    this.item = new BehaviorSubject(null);
  }

  setItemValue(value): void {
    this.item.next(value);
  }

  public getItemValue() {
    return this.item.asObservable();
  }

  async fetchData(parkSk = null, facilitySk = null, passDate = null) {
    let res = null;
    let errorSubject = '';
    try {
      if (parkSk && facilitySk && passDate) {
        // We are getting reservations levels for a specified facility and date
        errorSubject = 'rescounts';
        let queryObj = {
          park: parkSk,
          facility: facilitySk,
          date: passDate
        };

        res = await this.apiService.get('rescount', queryObj);
        this.setItemValue(res);
      }
    } catch (e) {
      this.toastService.addMessage(
        `An error has occured while getting ${errorSubject}.`,
        'Rescount Service',
        Constants.ToastTypes.ERROR
      );
      this.eventService.setError(new EventObject(EventKeywords.ERROR, e, 'Rescount Service'));
    }
  }
}
