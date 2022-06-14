import { Injectable } from '@angular/core';
import { ISearchResults } from 'app/shared/models/search';
import { DateTime } from 'luxon';

const encode = encodeURIComponent;
window['encodeURIComponent'] = (component: string) => {
  return encode(component).replace(/[!'()*]/g, (c) => {
    // Also encode !, ', (, ), and *
    return '%' + c.charCodeAt(0).toString(16);
  });
};

@Injectable()
export class Utils {
  constructor() { }

  public encodeString(filename: string, isUrl: boolean) {
    let safeName;
    if (isUrl) {
      safeName = encode(filename).replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\\/g, '_').replace(/\//g, '_').replace(/\%2F/g, '_').replace(/ /g, '_');
      return safeName;
    } else {
      safeName = filename.replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\\/g, '_').replace(/\//g, '_');
      return safeName;
    }

  }

  // This function will take in a ISearchResults of some type and return an array of that same type
  public extractFromSearchResults<T>(results: ISearchResults<T>[]): T[] {
    if (!results || !Array.isArray(results)) {
      return null;
    }
    const data = results[0].data;
    if (!data) { return null; }
    return <T[]>data.searchResults;
  }

  public convertJSDateToNGBDate(jSDate: Date) {
    if (!jSDate) {
      return null;
    }

    return {
      year: jSDate.getFullYear(),
      month: jSDate.getMonth() + 1,
      day: jSDate.getDate()
    };
  }

  public convertJSDateToString(jSDate: Date) {
    if (!jSDate) {
      return null;
    }

    return `${jSDate.getFullYear()}-${jSDate.getMonth() + 1}-${jSDate.getDate()}`;
  }

  public convertFormGroupNGBDateToJSDate(nGBDate, nGBTime = null) {
    if (!nGBDate) {
      return null;
    }

    if (nGBTime === null) {
      return new Date(nGBDate.year, nGBDate.month - 1, nGBDate.day);
    } else {
      return new Date(nGBDate.year, nGBDate.month - 1, nGBDate.day, nGBTime.hour, nGBTime.minute);
    }
  }

  public convertFormGroupNGBDateToISODate(nGBDate, nGBTime = null) {
    if (!nGBDate) {
      return null;
    }

    let datetime = DateTime.fromObject(
      {
        year: nGBDate.year,
        month: nGBDate.month,
        day: nGBDate.day,
        hour: 12
      },
      {
        zone: 'America/Vancouver'
      }
    );

    if (nGBTime) {
      datetime.set(
        {
          hour: nGBTime.hour,
          minute: nGBTime.minute
        }
      );
    }

    return datetime.toISO();
  }

  public convert24hTo12hTime(hour: number): { hour: string, amPm: string } {
    if (hour === 0) {
      return { hour: '12', amPm: 'AM' };
    } else if (hour === 12) {
      return { hour: '12', amPm: 'PM' };
    } else if (hour && hour < 12) {
      return { hour: hour.toString(), amPm: 'AM' };
    }  else if (hour && hour > 12) {
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

}
