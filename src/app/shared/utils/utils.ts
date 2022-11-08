import * as moment from 'moment';
import { DateTime } from 'luxon';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

const TIMEZONE = 'America/Vancouver'

export class Utils {

  public convertArrayIntoObjForTypeAhead(
    array,
    valueToUseAsKey,
    valueToUseForTypeAhead
  ) {
    let obj = { typeAheadData: [] as any[] };
    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      obj[element[valueToUseAsKey]] = element;
      obj.typeAheadData.push(element[valueToUseForTypeAhead]);
    }
    return obj;
  }

  public convertArrayIntoObjForSelect(
    array,
    valueToUseAsKey,
    valueToUseForSelectId,
    valueToUseForSelectLabel
  ) {
    let obj = { selectData: [] as any[] };
    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      obj[element[valueToUseAsKey]] = element;
      obj.selectData.push({
        id: element[valueToUseForSelectId],
        label: element[valueToUseForSelectLabel],
      });
    }
    return obj;
  }

  public convertJSDateToNGBDate(jSDate: Date) {
    if (!jSDate) {
      return null;
    }

    return {
      year: jSDate.getFullYear(),
      month: jSDate.getMonth() + 1,
      day: jSDate.getDate(),
    };
  }

  public convertJSDateToYYYYMM(date: Date) {
    return moment(date).format('YYYYMM');
  }

  public convertYYYYMMToJSDate(date) {
    return new Date(date.substring(0, 4), date.slice(-2) - 1);
  }

  public convertYYYYMMToMMMMYYYY(date) {
    return moment(new Date(date.substring(0, 4), date.slice(-2) - 1)).format(
      'MMMM YYYY'
    );
  }

  public getTodayAsShortDate() {
    return DateTime.now().setZone(TIMEZONE).toISODate();
  }

  public convertJSDateToShortDate(date: Date): string {
    return DateTime.fromJSDate(date).setZone(TIMEZONE).toISODate();
  }

  public convertShortDateToJSDate(date: string): Date {
    return DateTime.fromFormat(date, 'YYYY-MM-DD').setZone(TIMEZONE).toJSDate();
  }

  public convertJSDateToNgbTimeStruct(date: Date): NgbTimeStruct {
    return {
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds(),
    };
  }
}
