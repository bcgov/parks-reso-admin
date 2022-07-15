import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from 'app/shared/utils/constants';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { EventKeywords, EventObject, EventService } from './event.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
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

  async fetchData(park, facility, date) {
    let res = null;
    let errorSubject = 'reservations';
    try {
      res = await this.apiService.get('reservation', { park: park, facility: facility, date: date });
      res = res[0];

      if (!res) {
        this.setItemValue({});
      } else {
        this.setItemValue(res);
      }
    } catch (e) {
      this.toastService.addMessage(
        `An error has occured while getting ${errorSubject}.`,
        'Reservation Service',
        Constants.ToastTypes.ERROR
      );
      this.eventService.setError(new EventObject(EventKeywords.ERROR, e, 'Reservation Service'));
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
}
