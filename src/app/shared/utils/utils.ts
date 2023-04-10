import * as moment from 'moment';
import { DateTime, Interval } from 'luxon';
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

  // Converts current epoch time to ISO date in TIMEZONE.
  public getTodaysDate() {
    return DateTime.now().setZone(TIMEZONE).toISO();
  }

  // Converts current epoch time to calendar short date in TIMEZONE.
  public getTodayAsShortDate() {
    return DateTime.now().setZone(TIMEZONE).toISODate();
  }

  // Chops short date from JSDate. Timezones not respected.
  // Useful if receiving JSDate from a datepicker and we want the calendar date picked irrespective of browser/server tz.
  public convertJSDateToShortDate(date: Date): string {
    return DateTime.fromJSDate(date).toISODate();
  }

  // Converts zoned JSDate to zoned short date, respecting any change in timezone.
  public convertJSDateToZonedShortDate(date: Date): string {
    return DateTime.fromJSDate(date).setZone(TIMEZONE).toISODate();
  }

  // Converts short date to 00:00:00.000 JSDate in TIMEZONE.
  public convertShortDateToJSDate(date: string): Date {
    return DateTime.fromFormat(date, 'yyyy-LL-dd').setZone(TIMEZONE).toJSDate();
  }

  public convertJSDateToNgbTimeStruct(date: Date): NgbTimeStruct {
    return {
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds(),
    };
  }

  // returns an array of every date in the interval between startDate & endDate inclusive
  public createShortDateInterval(startDate, endDate): string[] {
    const interval = Interval.fromDateTimes(
      DateTime.fromISO(startDate).startOf('day'),
      DateTime.fromISO(endDate).endOf('day'),
    ).splitBy({ day: 1 }).map(d => d.start.toISODate());
    return interval;
  }

  // Provides an html link to download a csv file
  downloadCSV(filename: string, csv: string): void {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
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
