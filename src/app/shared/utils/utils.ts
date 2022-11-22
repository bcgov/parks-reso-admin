import * as moment from 'moment';
import { DateTime } from 'luxon';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

const TIMEZONE = 'America/Vancouver';

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

  public getTodaysDate() {
    return DateTime.now().setZone(TIMEZONE);
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

  public capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  public convert24hTo12hTime(hour: number): { hour: string; amPm: string } {
    if (hour === 0) {
      return { hour: '12', amPm: 'AM' };
    } else if (hour === 12) {
      return { hour: '12', amPm: 'PM' };
    } else if (hour && hour < 12) {
      return { hour: hour.toString(), amPm: 'AM' };
    } else if (hour && hour > 12) {
      return { hour: (hour - 12).toString(), amPm: 'PM' };
    } else {
      return { hour: null, amPm: null };
    }
  }

  public convert12hTo24hTime(hour: string, amPm: string): number {
    if (hour === '12' && amPm === 'AM') {
      return 0;
    } else if (hour === '12' && amPm === 'PM') {
      return 12;
    } else if (amPm === 'AM') {
      return parseInt(hour, 10);
    } else if (amPm === 'PM') {
      return parseInt(hour, 10) + 12;
    } else {
      return null;
    }
  }

  buildInnerHTMLRow(arr): string {
    let str = `<div class="row">`;
    let columns = '';
    for (const column of arr) {
      columns += `<div class="col mb-4">${column}</div>`;
    }
    str += columns + `</div>`;
    return str;
  }
}
