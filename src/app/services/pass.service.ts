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
export class PassService {
  private item: BehaviorSubject<any>;
  private list: BehaviorSubject<any>;
  public lastSearchParams = {
    passSk: null,
    parkSk: null,
    facilitySk: null,
    passType: null,
    ExclusiveStartKeyPK: null,
    ExclusiveStartKeySK: null,
    queryParams: null
  };

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

  async fetchData(
    passSk = null,
    parkSk = null,
    facilitySk = null,
    passType = null,
    ExclusiveStartKeyPK = null,
    ExclusiveStartKeySK = null,
    queryParams = null
  ) {
    let res = null;
    let errorSubject = '';
    try {
      if (!passSk && parkSk && facilitySk && passType) {
        // We are getting list of passes filtered with type
        errorSubject = 'passes';
        let queryObj = {
          park: parkSk,
          facilityName: facilitySk,
          passType: passType
        };
        if (ExclusiveStartKeyPK && ExclusiveStartKeySK) {
          queryObj['ExclusiveStartKeyPK'] = ExclusiveStartKeyPK;
          queryObj['ExclusiveStartKeySK'] = ExclusiveStartKeySK;
        }

        if (queryParams) {
          Object.keys(queryParams).forEach(key => {
            queryObj[key] = queryParams[key];
          });
        }

        res = await this.apiService.get('pass', queryObj);
        this.setListValue(res);
        this.lastSearchParams = {
          passSk: passSk,
          parkSk: parkSk,
          facilitySk: facilitySk,
          passType: passType,
          ExclusiveStartKeyPK: ExclusiveStartKeyPK,
          ExclusiveStartKeySK: ExclusiveStartKeySK,
          queryParams: queryParams
        };
        return res;
      }
    } catch (e) {
      this.toastService.addMessage(
        `An error has occured while getting ${errorSubject}.`,
        'Pass Service',
        Constants.ToastTypes.ERROR
      );
      this.eventService.setError(new EventObject(EventKeywords.ERROR, e, 'Pass Service'));
      this.router.navigate(['../', { relativeTo: this.route }]);
    }
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
      res = await this.apiService.delete('pass', { passId: passId, park: parkSk });
      this.setItemValue(res);
    } catch (e) {
      this.toastService.addMessage(
        `An error has occured while canceling Pass.`,
        'Pass Service',
        Constants.ToastTypes.ERROR
      );
      this.eventService.setError(new EventObject(EventKeywords.ERROR, e, 'Pass Service'));
      throw e;
    }
  }
}
