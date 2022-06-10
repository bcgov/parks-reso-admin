import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParkSubObject, PostPark, PutPark } from 'app/models/park';
import { Constants } from 'app/shared/utils/constants';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { EventKeywords, EventObject, EventService } from './event.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class ParkService {
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

  async fetchData(sk = null) {
    let res = null;
    let errorSubject = '';
    try {
      if (sk) {
        // we're getting a single item
        errorSubject = 'park';
        res = await this.apiService.get('park', { park: sk });
        res = res[0];
        // TODO: checks before sending back item.
        this.setItemValue(res);

      } else {
        errorSubject = 'parks';
        // We're getting a list
        res = await this.apiService.get('park');
        this.setListValue(res);
      }
    } catch (e) {
      this.toastService.addMessage(`An error has occured while getting ${errorSubject}.`, 'Park Service', Constants.ToastTypes.ERROR);
      this.eventService.setError(
        new EventObject(
          EventKeywords.ERROR,
          e,
          'Park Service'
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

  async createPark(obj) {
    let res = null;
    try {
      // Remove non-valid fields and verify field types.
      this.checkManditoryFields(obj);

      let postObj = new PostPark(obj);
      postObj.park = new ParkSubObject(obj);

      postObj['facilities'] = [];
      res = await this.apiService.post('park', postObj);
    } catch (e) {
      this.toastService.addMessage(`An error has occured while creating park.`, 'Park Service', Constants.ToastTypes.ERROR);
      this.eventService.setError(
        new EventObject(
          EventKeywords.ERROR,
          e,
          'Park Service'
        )
      );
      this.router.navigate(['../', { relativeTo: this.route }]);
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
      this.toastService.addMessage(`An error has occured while editing park.`, 'Park Service', Constants.ToastTypes.ERROR);
      this.eventService.setError(
        new EventObject(
          EventKeywords.ERROR,
          e,
          'Park Service'
        )
      );
      this.router.navigate(['../', { relativeTo: this.route }]);
      throw e;
    }
    return res;
  }

  private checkManditoryFields(obj) {
    if (obj.name === '' || !obj.name) {
      throw 'You must provide a park name';
    }
    if (obj.orcs === '' || !obj.orcs) {
      throw ('You must provide a park orcs');
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
