import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Constants } from '../shared/utils/constants';
import { Utils } from '../shared/utils/utils';
import { ApiService } from './api.service';
import { DataService } from './data.service';
import { EventKeywords, EventObject, EventService } from './event.service';
import { LoadingService } from './loading.service';
import { LoggerService } from './logger.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class ModifierService {
  private utils = new Utils();

  constructor(
    private apiService: ApiService,
    private eventService: EventService,
    private toastService: ToastService,
    private loggerService: LoggerService,
    private loadingService: LoadingService,
    private dataService: DataService
  ) {}

  async fetchData(park, facility, date) {
    let dataTag = '';
    let modifierList: any[] = [];
    let errorSubject = 'modifiers';
    try {
      dataTag = Constants.dataIds.MODIFIERS;
      this.loadingService.addToFetchList(dataTag);
      this.loggerService.debug(`GET Reservation ${park} ${facility} ${date}`);
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
      this.loggerService.error(`${JSON.stringify(e)}`);
      this.toastService.addMessage(
        `An error has occured while getting ${errorSubject}.`,
        'Modifier Service',
        Constants.ToastTypes.ERROR
      );
      this.eventService.setError(
        new EventObject(EventKeywords.ERROR, String(e), 'Modifier Service')
      );
    }
    this.loadingService.removeToFetchList(dataTag);
  }

  /**
   * Sets a modifier by sending a PUT request to the API and handles the response.
   * Logs the operation, updates data, and displays success or error messages.
   *
   * @param obj - The modifier object to be sent to the API. It should include necessary
   *              details such as parkOrcs and facility for data fetching.
   * @returns A promise resolving to the response from the API.
   *
   * @throws Will log and handle any errors encountered during the API request.
   *
   * @remarks
   * - On success, it fetches updated data and displays a success toast message.
   * - On failure, it logs the error, displays an error toast message, and sets an error event.
   * Example:
   * {
   *   "date": "2022-08-08T19:00:00.000Z",
   *   "bookingTimes": {
   *       "AM": "5000"
   *   },
   *   "parkName": "Garibaldi Provincial Park",
   *   "facility": "Cheakamus"
   * }
   */
  async setModifier(obj) {
    let res;
    try {
      this.loggerService.debug(`PUT modifier ${JSON.stringify(obj)}`);
      res = await firstValueFrom(this.apiService.put('modifier', obj));
      const today = this.utils.getTodaysDate();
      this.fetchData(obj.parkOrcs, obj.facility, today);
      this.toastService.addMessage(
        `Modifier set`,
        'Modifier Service',
        Constants.ToastTypes.SUCCESS
      );
    } catch (error: any) {
      this.loggerService.error(`${JSON.stringify(error)}`);
      this.toastService.addMessage(
        `${error.error}`,
        'Modifier Service',
        Constants.ToastTypes.ERROR
      );
      this.eventService.setError(
        new EventObject(EventKeywords.ERROR, String(error), 'Modifier Service')
      );
    }
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
      parkOrcs: park,
      facility: facility,
    };

    let res;
    try {
      this.loggerService.debug(`PUT modifier ${JSON.stringify(obj)}`);
      res = await firstValueFrom(this.apiService.put('modifier', obj));
      const today = this.utils.getTodaysDate();
      this.fetchData(park, facility, today);
      this.toastService.addMessage(
        `Modifier removed`,
        'Modifier Service',
        Constants.ToastTypes.SUCCESS
      );
    } catch (error) {
      this.loggerService.error(`${JSON.stringify(error)}`);
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
