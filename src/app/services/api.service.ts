import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtUtil } from 'app/shared/utils/jwt-utils';
import { Observable, throwError } from 'rxjs';
import { ConfigService } from './config.service';
import { KeycloakService } from './keycloak.service';
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
    private logger: LoggerService,
    private keycloakService: KeycloakService
  ) {
    this.apiPath = this.configService.config['API_LOCATION']
      + this.configService.config['API_PATH'];
    this.env = this.configService.config['ENVIRONMENT'];
  }

  public getEnvironment(): string {
    return this.env;
  }

  public getWelcomeMessage(): string {
    const token = this.keycloakService.getToken();

    if (!token) {
      return '';
    }

    const jwt = JwtUtil.decodeToken(token);

    if (!jwt) {
      return '';
    }

    return `Hello ${jwt.displayName}`;
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

  post(pk, obj, queryParamsObject = null): Promise<any> {
    let queryString = this.generateQueryString(queryParamsObject);
    return this.http.post<any>(`${this.apiPath}/${pk}?${queryString}`, obj, {}).toPromise();
  }

  put(pk, obj, queryParamsObject = null): Promise<any> {
    let queryString = this.generateQueryString(queryParamsObject);
    // This is not a mistake, we use post to edit in AWS.
    return this.http.post<any>(`${this.apiPath}/${pk}?${queryString}`, obj, {}).toPromise();
  }

  get(pk, queryParamsObject = null): Promise<any> {
    let queryString = this.generateQueryString(queryParamsObject);
    return this.http.get<any>(`${this.apiPath}/${pk}?${queryString}`, {}).toPromise();
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
