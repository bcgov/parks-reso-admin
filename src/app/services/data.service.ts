import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Constants } from '../shared/utils/constants';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private data;

  constructor() {
    this.data = {};
  }

  initItem(id): void {
    this.data[id] = new BehaviorSubject(null);
  }

  setItemValue(id, value): void {
    this.checkIfDataExists(id) ? null : this.initItem(id);
    this.data[id].next(value);
  }

  // Append array data to existing dataService id
  appendItemValue(id, value): any[] {
    // We cannot concatenate an undefined object
    if (!this.checkIfDataExists(id) || !this.getItemValue(id)) {
      this.setItemValue(id, value);
      return [];
    } else {
      const appendObj = this.getItemValue(id).concat(value);
      this.data[id].next(appendObj);
      return appendObj;
    }
  }

  // Merge object data to existing dataService id
  mergeItemValue(id, value, attribute = null): any {
    // We cannot merge to an undefined object
    if (!this.checkIfDataExists(id) || !this.getItemValue(id)) {
      this.setItemValue(id, value);
      return null;
    } else {
      const assignObj = Object.assign(this.getItemValue(id), value);
      this.data[id].next(assignObj);
      return assignObj;
    }
  }

  public watchItem(id) {
    this.checkIfDataExists(id) ? null : this.initItem(id);
    return this.data[id];
  }

  public getItemValue(id) {
    this.checkIfDataExists(id) ? null : this.initItem(id);
    return this.data[id].value;
  }

  clearItemValue(id): void {
    this.setItemValue(id, null);
  }

  checkIfDataExists(id) {
    return this.data[id] ? true : false;
  }

  async updateParkAndFacilityCache(obj) {
    const cachedObj = this.getItemValue(
      Constants.dataIds.PARK_AND_FACILITY_LIST
    );
    if (obj.pk === 'park') {
      if (cachedObj[obj.sk]) {
        obj.facilities = cachedObj[obj.sk].facilities;
        cachedObj[obj.sk] = obj;
      } else {
        throw 'Error updating cache, please refresh the page.';
      }
    } else if (obj.pk.includes('facility::')) {
      const parkId = obj.pk.split('::')[1];
      if (cachedObj[parkId]) {
        cachedObj[parkId].facilities[obj.sk] = obj;
      } else {
        throw 'Error updating cache, please refresh the page.';
      }
    }
    this.setItemValue(Constants.dataIds.PARK_AND_FACILITY_LIST, cachedObj);
  }
}
