import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public token: string;
  public isMS: boolean; // IE, Edge, etc

  apiPath: string;
  env: 'local' | 'dev' | 'test' | 'prod';

  constructor(private http: HttpClient, private configService: ConfigService) {}

  init() {
    this.apiPath =
      this.configService.config['API_LOCATION'] +
      this.configService.config['API_PATH'];
    this.env = this.configService.config['ENVIRONMENT'];
  }

  public getEnvironment(): string {
    return this.env;
  }

  get(pk, queryParamsObject = null as any) {
    let queryString = this.generateQueryString(queryParamsObject);
    return this.http.get<any>(`${this.apiPath}/${pk}?${queryString}`)
      .pipe(catchError(this.errorHandler))
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }

  put(pk, obj, queryParamsObject = null as any) {
    let queryString = this.generateQueryString(queryParamsObject);
    return this.http.put<any>(`${this.apiPath}/${pk}?${queryString}`, obj)
      .pipe(catchError(this.errorHandler))
  }

  post(pk, obj, queryParamsObject = null as any) {
    let queryString = this.generateQueryString(queryParamsObject);
    return this.http.post<any>(`${this.apiPath}/${pk}?${queryString}`, obj)
      .pipe(catchError(this.errorHandler))
  }

  delete(pk, queryParamsObject = null as any) {
    let queryString = this.generateQueryString(queryParamsObject);
    return this.http.delete<any>(`${this.apiPath}/${pk}?${queryString}`)
      .pipe(catchError(this.errorHandler))
  }

  private generateQueryString(queryParamsObject) {
    let queryString = '';
    if (queryParamsObject) {
      for (let key of Object.keys(queryParamsObject)) {
        queryString += `&${key}=${queryParamsObject[key]}`;
      }
      queryString = queryString.substring(1);
    }
    return queryString;
  }
}
