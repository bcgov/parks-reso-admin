import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostFacility, PutFacility } from 'app/models/facility';
import { Constants } from 'app/shared/utils/constants';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { EventKeywords, EventObject, EventService } from './event.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class FacilityService {
  private item: BehaviorSubject<any>;
  private list: BehaviorSubject<any>;

  constructor(
    private apiService: ApiService,
    private eventService: EventService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
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
    let errorSubject = '';
    try {
      if (!facilitySk && parkSk) {
        // We are getting a facilities of a given park.
        errorSubject = 'facilities';
        res = await this.apiService.get('facility', { park: parkSk, facilities: true });
        this.setListValue(res);
      } else if (facilitySk && parkSk) {
        errorSubject = 'facility';
        // we're getting a single item for a given park
        res = await this.apiService.get('facility', { facilityName: facilitySk, park: parkSk });
        res = res[0];
        this.setItemValue(res);
      } else {
        // We're getting a list
        errorSubject = 'facilities';
        res = await this.apiService.get('facility');
        this.setListValue(res);
      }
    } catch (e) {
      this.toastService.addMessage(`An error has occured while getting ${errorSubject}.`, 'Facility Service', Constants.ToastTypes.ERROR);
      this.eventService.setError(
        new EventObject(
          EventKeywords.ERROR,
          e,
          'Facility Service'
        )
      );
      this.router.navigate(['../', { relativeTo: this.route }]);
      throw e;
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
    let res = null;
    try {
      // Remove non-valid fields and verify field types.
      this.checkManditoryFields(obj);
      if (parkSk === '' || !parkSk) {
        throw ('You must provide a park sk');
      }
      let postObj = new PostFacility(obj);
      postObj.parkName = parkSk;
      res = await this.apiService.post('facility', postObj);
    } catch (e) {
      this.toastService.addMessage(`An error has occured while creating facility.`, 'Facility Service', Constants.ToastTypes.ERROR);
      this.eventService.setError(
        new EventObject(
          EventKeywords.ERROR,
          e,
          'Faciltiy Service'
        )
      );
      this.router.navigate(['../', { relativeTo: this.route }]);
      throw e;
    }
    return res;
  }

  async editFacility(obj, parkSk) {
    let res = null;
    try {
      // To do an edit we need to pass back the entire object with all old and new fields.
      this.checkManditoryFields(obj);
      if (parkSk === '' || !parkSk) {
        throw ('You must provide a park sk');
      }
      if (!obj.pk) {
        throw ('You must provide a facility pk');
      }
      if (!obj.sk) {
        throw ('You must provide a facility sk');
      }

      let putObj = new PutFacility(obj);
      putObj.parkName = parkSk;

      // We must tell API that we are editing faciltiy.
      // This is to prevent reservations object from being overwritten.
      putObj['mode'] = 'editFacililty';
      res = await this.apiService.put('facility', putObj);
    } catch (e) {
      this.toastService.addMessage(`An error has occured while editing facility.`, 'Faciltiy Service', Constants.ToastTypes.ERROR);
      this.eventService.setError(
        new EventObject(
          EventKeywords.ERROR,
          e,
          'Facility Service'
        )
      );
      this.router.navigate(['../', { relativeTo: this.route }]);
      throw e;
    }
    return res;
  }

  private checkManditoryFields(obj) {
    if (obj.name === '' || !obj.name) {
      throw ('You must provide a facility name');
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
