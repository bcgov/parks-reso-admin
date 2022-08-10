import { Injectable } from '@angular/core';
import { Constants } from 'app/shared/utils/constants';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { EventKeywords, EventObject, EventService } from './event.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class ModifierService {
  private list: BehaviorSubject<any>;
  constructor(private apiService: ApiService, private eventService: EventService, private toastService: ToastService) {
    this.list = new BehaviorSubject([]);
  }

  setListValue(value): void {
    this.list.next(value);
  }

  public getListValue() {
    return this.list.asObservable();
  }

  async fetchData(park, facility, date) {
    let modifierList = [];
    let errorSubject = 'modifiers';
    try {
      const res = await this.apiService.get('reservation', {
        park: park,
        facility: facility,
        date: date,
        getFutureReservationObjects: true
      });

      //   TODO: Push this into the backend
      for (let i = 0; i < res.length; i++) {
        const resObj = res[i];
        for (const key in resObj.capacities) {
          if (resObj.capacities[key].capacityModifier) {
            modifierList.push(resObj);
            break;
          }
        }
      }
      this.setListValue(modifierList);
    } catch (e) {
      console.log(e);
      this.toastService.addMessage(
        `An error has occured while getting ${errorSubject}.`,
        'Modiifier Service',
        Constants.ToastTypes.ERROR
      );
      this.eventService.setError(new EventObject(EventKeywords.ERROR, e, 'Modiifier Service'));
    }
  }

  //   {
  //     "date": "2022-08-08T19:00:00.000Z",
  //     "bookingTimes": {
  //         "AM": "5000"
  //     },
  //     "parkName": "Garibaldi Provincial Park",
  //     "facility": "Cheakamus"
  //   }
  async setModifier(obj) {
    let res = null;
    try {
      res = this.apiService.put('modifier', obj);
      this.toastService.addMessage(`Modifier set`, 'Modifier Service', Constants.ToastTypes.SUCCESS);
    } catch (error) {
      this.toastService.addMessage(
        `An error has occured while setting modifier.`,
        'Modifier Service',
        Constants.ToastTypes.ERROR
      );
      this.eventService.setError(new EventObject(EventKeywords.ERROR, error, 'Modifier Service'));
    }

    // TODO: kick off reservations list get

    return res;
  }

  async deleteModifier(park, facility, date) {
    let obj = {
      date: date,
      bookingTimes: {
        AM: 0,
        PM: 0,
        DAY: 0
      },
      parkName: park,
      facility: facility
    };

    let res = null;
    try {
      res = this.apiService.put('modifier', obj);
      this.toastService.addMessage(`Modifier removed`, 'Modifier Service', Constants.ToastTypes.SUCCESS);
    } catch (error) {
      this.toastService.addMessage(
        `An error has occured while setting modifier.`,
        'Modifier Service',
        Constants.ToastTypes.ERROR
      );
      this.eventService.setError(new EventObject(EventKeywords.ERROR, error, 'Modifier Service'));
    }

    // TODO: kick off reservations list get

    return res;
  }
}
