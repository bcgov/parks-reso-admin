import { Injectable } from '@angular/core';
import { ISearchResults } from 'app/shared/models/search';

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
}
