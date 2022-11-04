import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Constants } from '../shared/utils/constants';
import { ApiService } from './api.service';
import { DataService } from './data.service';
import { EventKeywords, EventObject, EventService } from './event.service';
import { LoadingService } from './loading.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class ModifierService {
  private list: BehaviorSubject<any>;
  constructor(
    private apiService: ApiService,
    private eventService: EventService,
    private toastService: ToastService,
    private loadingService: LoadingService,
    private dataService: DataService
  ) {
    this.list = new BehaviorSubject([]);
  }

  async fetchData(park, facility, date) {
    let dataTag = '';
    let modifierList: any[] = [];
    let errorSubject = 'modifiers';
    try {
      dataTag = Constants.dataIds.MODIFIERS;
      this.loadingService.addToFetchList(dataTag);

      const res = await firstValueFrom(
        this.apiService.get('reservation', {
          park: park,
          facility: facility,
          date: date,
          getFutureReservationObjects: true,
        })
      );

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
      this.dataService.setItemValue(dataTag, modifierList);
    } catch (e) {
      console.log(e);
      this.toastService.addMessage(
        `An error has occured while getting ${errorSubject}.`,
        'Modiifier Service',
        Constants.ToastTypes.ERROR
      );
      this.eventService.setError(
        new EventObject(EventKeywords.ERROR, String(e), 'Modiifier Service')
      );
    }
    this.loadingService.removeToFetchList(dataTag);
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
    let res;
    try {
      res = this.apiService.put('modifier', obj);
      this.toastService.addMessage(
        `Modifier set`,
        'Modifier Service',
        Constants.ToastTypes.SUCCESS
      );
    } catch (error) {
      this.toastService.addMessage(
        `An error has occured while setting modifier.`,
        'Modifier Service',
        Constants.ToastTypes.ERROR
      );
      this.eventService.setError(
        new EventObject(EventKeywords.ERROR, String(error), 'Modifier Service')
      );
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
        DAY: 0,
      },
      parkName: park,
      facility: facility,
    };

    let res;
    try {
      res = this.apiService.put('modifier', obj);
      this.toastService.addMessage(
        `Modifier removed`,
        'Modifier Service',
        Constants.ToastTypes.SUCCESS
      );
    } catch (error) {
      this.toastService.addMessage(
        `An error has occured while setting modifier.`,
        'Modifier Service',
        Constants.ToastTypes.ERROR
      );
      this.eventService.setError(
        new EventObject(EventKeywords.ERROR, String(error), 'Modifier Service')
      );
    }

    // TODO: kick off reservations list get
    return res;
  }
}
