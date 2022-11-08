import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Constants } from '../shared/utils/constants';
import { ApiService } from './api.service';
import { DataService } from './data.service';
import { EventKeywords, EventObject, EventService } from './event.service';
import { LoadingService } from './loading.service';
import { ToastService, ToastTypes } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  constructor(
    private dataService: DataService,
    private eventService: EventService,
    private toastService: ToastService,
    private apiService: ApiService,
    private loadingService: LoadingService
  ) {}

  async fetchData(parkSk, facilitySk, resDate = null, selectedPassType = null) {
    let res;
    let errorSubject = '';
    let dataTag;
    try {
      if (resDate) {
        // We are getting a single reservations object.
        dataTag = Constants.dataIds.CURRENT_RESERVATIONS_OBJECT;
        this.loadingService.addToFetchList(dataTag);
        errorSubject = 'facility reservation';
        res = await firstValueFrom(
          this.apiService.get('reservation', {
            park: parkSk,
            facility: facilitySk,
            date: resDate,
          })
        );
      }
      this.dataService.setItemValue(dataTag, res);

      if (resDate && selectedPassType) {
        this.setCapacityBar(res[0], selectedPassType);
      } else {
        // Set to initialized but invalid state
        this.dataService.setItemValue(
          Constants.dataIds.CURRENT_CAPACITY_BAR_OBJECT,
          {
            capPercent: 0,
            reserved: null as any,
            capacity: null as any,
            modifier: 0,
            style: 'success',
          }
        );
      }
    } catch (e) {
      this.toastService.addMessage(
        `Please refresh the page.`,
        `Error getting ${errorSubject}`,
        ToastTypes.ERROR
      );
      this.eventService.setError(
        new EventObject(EventKeywords.ERROR, String(e), 'Reservation Service')
      );
      // TODO: We may want to change this.
      if (errorSubject === 'facility reservations')
        this.dataService.setItemValue(dataTag, 'error');
    }
    this.loadingService.removeToFetchList(dataTag);
    return res;
  }

  setCapacityBar(reservationObj, selectedPassType) {
    let capBarObj = {
      capPercent: 0,
      reserved: 0,
      capacity: 0,
      modifier: 0,
      style: 'success',
    };

    if (
      reservationObj &&
      reservationObj.capacities &&
      reservationObj.capacities[selectedPassType]
    ) {
      const modifiedCapacity =
        reservationObj.capacities[selectedPassType].baseCapacity +
        reservationObj.capacities[selectedPassType].capacityModifier;
      capBarObj.capacity = modifiedCapacity;
      capBarObj.reserved =
        modifiedCapacity -
        reservationObj.capacities[selectedPassType].availablePasses;
      capBarObj.modifier =
        reservationObj.capacities[selectedPassType].capacityModifier;
    }

    capBarObj.capPercent = capBarObj.capacity
      ? Math.floor((capBarObj.reserved / capBarObj.capacity) * 100)
      : 0;
    capBarObj.style = this.calculateProgressBarColour(capBarObj.capPercent);

    this.dataService.setItemValue(
      Constants.dataIds.CURRENT_CAPACITY_BAR_OBJECT,
      capBarObj
    );
  }

  public calculateProgressBarColour(capPercent) {
    if (capPercent < 25) {
      return 'success';
    } else if (capPercent < 75) {
      return 'warning';
    } else {
      return 'danger';
    }
  }
}
