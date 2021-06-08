import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ConfigService } from './config.service';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public token: string;
  public isMS: boolean; // IE, Edge, etc

  apiPath: string;
  env: 'local' | 'dev' | 'test' | 'prod';

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private logger: LoggerService
  ) {
    this.apiPath = this.configService.config['API_LOCATION']
      + this.configService.config['API_PATH'];
    this.env = this.configService.config['ENVIRONMENT'];
  }

  handleError(error: any): Observable<never> {
    let errorMessage = 'Unknown Server Error';

    if (error) {
      if (error.message) {
        if (error.error) {
          errorMessage = `${error.message} - ${error.error.message}`;
        } else {
          errorMessage = error.message;
        }
      } else if (error.status) {
        errorMessage = `${error.status} - ${error.statusText}`;
      }
    }

    this.logger.log(`Server Error: ${errorMessage}`);
    return throwError(error);
  }

  get(pk, sk, queryParamsObject): Observable<any> {
    let queryParams = '';
    if (queryParamsObject) {
      for (let key of Object.keys(queryParamsObject)) {
        queryParams += `&${key}=${queryParamsObject[key]}`;
      }
    }

    return this.http.get<any>(`${this.apiPath}/${pk}?${pk}=${sk}${queryParams}`, {});
  }

  getList(pk): Observable<any> {
    return this.http.get<any>(`${this.apiPath}/${pk}`, {});
  }
}
