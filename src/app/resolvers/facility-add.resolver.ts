import { Injectable } from '@angular/core';

import { DataService } from '../services/data.service';
import { Constants } from '../shared/utils/constants';

@Injectable({
  providedIn: 'root',
})
export class FacilityAddResolver  {
  constructor(protected dataService: DataService) {}
  resolve() {
    this.dataService.setItemValue(Constants.dataIds.CURRENT_FACILITY_KEY, null);
  }
}
