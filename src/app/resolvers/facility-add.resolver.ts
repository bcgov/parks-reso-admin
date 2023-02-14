import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { DataService } from '../services/data.service';
import { Constants } from '../shared/utils/constants';

@Injectable({
  providedIn: 'root',
})
export class FacilityAddResolver implements Resolve<void> {
  constructor(protected dataService: DataService) {}
  resolve() {
    this.dataService.setItemValue(Constants.dataIds.CURRENT_FACILITY, null);
  }
}
