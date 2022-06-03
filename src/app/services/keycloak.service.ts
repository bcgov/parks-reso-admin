import { Injectable } from '@angular/core';
import { JwtUtil } from 'app/shared/utils/jwt-utils';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { LoggerService } from './logger.service';
import { CookieService } from 'ngx-cookie-service';

declare let Keycloak: any;

@Injectable()
export class KeycloakService {
  private keycloakAuth: any;
  private keycloakEnabled: boolean;
  private keycloakUrl: string;
  private keycloakRealm: string;

  AUTOLOGIN_COOKIE_NAME = 'KEYCLOAK_TRIED_AUTOLOGIN';

  constructor(
    private configService: ConfigService,
    private logger: LoggerService,
    private cookieService: CookieService
  ) {}

  async init() {
    // Load up the config service data
    this.keycloakEnabled = this.configService.config['KEYCLOAK_ENABLED'];
    this.keycloakUrl = this.configService.config['KEYCLOAK_URL'];
    this.keycloakRealm = this.configService.config['KEYCLOAK_REALM'];

    if (this.keycloakEnabled) {
      // Bootup KC
      const keycloak_client_id = this.configService.config['KEYCLOAK_CLIENT_ID'];

      return new Promise<void>((resolve, reject) => {
        const config = {
          url: this.keycloakUrl,
          realm: this.keycloakRealm,
          clientId: !keycloak_client_id ? 'nrpti-admin' : keycloak_client_id
        };

        // console.log('KC Auth init.');

        this.keycloakAuth = new Keycloak(config);

        this.keycloakAuth.onAuthSuccess = () => {
          // console.log('onAuthSuccess');
        };

        this.keycloakAuth.onAuthError = () => {
          // console.log('onAuthError');
        };

        this.keycloakAuth.onAuthRefreshSuccess = () => {
          // console.log('onAuthRefreshSuccess');
        };

        this.keycloakAuth.onAuthRefreshError = () => {
          // console.log('onAuthRefreshError');
        };

        this.keycloakAuth.onAuthLogout = () => {
          console.log('onAuthLogout');
        };

        // Try to get refresh tokens in the background
        this.keycloakAuth.onTokenExpired = () => {
          this.keycloakAuth
            .updateToken()
            .success(refreshed => {
              this.logger.log(`KC refreshed token?: ${refreshed}`);
            })
            .error(err => {
              this.logger.log(`KC refresh error: ${err}`);
            });
        };

        // Initialize.
        this.keycloakAuth
          .init({ checkLoginIframe: false })
          .success(auth => {
            // console.log('KC Refresh Success?:', this.keycloakAuth.authServerUrl);
            this.logger.log(`KC Success: ${auth}`);
            resolve();
          })
          .error(err => {
            this.logger.log(`KC error: ${err}`);
            reject();
          });
      });
    }
  }

  /**
   * Check if the current user is logged in.
   *
   * @returns {boolean} true if the user is logged in.
   * @memberof KeycloakService
   */
  isAuthenticated(): boolean {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    const jwt = JwtUtil.decodeToken(token);

    if (!(jwt && jwt.preferred_username)) {
      return false;
    }

    return true;
  }

  /**
   * Check if the current user is logged in and has admin access.
   *
   * @returns {boolean} true if the user has access, false otherwise.
   * @memberof KeycloakService
   */
  isAuthorized(): boolean {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    const jwt = JwtUtil.decodeToken(token);

    if (!(jwt && jwt.resource_access
              && jwt.resource_access['parking-pass']
              && jwt.resource_access['parking-pass'].roles)) {
        return false;
      }

      return jwt.resource_access['parking-pass'].roles.length >= 1;
  }

  /**
   * Returns the current keycloak auth token.
   *
   * @returns {string} keycloak auth token.
   * @memberof KeycloakService
   */
  getToken(): string {
    return this.keycloakAuth && this.keycloakAuth.token;
  }

  /**
   * Returns an observable that emits when the auth token has been refreshed.
   * Call {@link KeycloakService#getToken} to fetch the updated token.
   *
   * @returns {Observable<string>}
   * @memberof KeycloakService
   */
  refreshToken(): Observable<any> {
    return new Observable(observer => {
      this.keycloakAuth
        .updateToken(30)
        .success(refreshed => {
          this.logger.log(`KC refreshed token?: ${refreshed}`);
          observer.next();
          observer.complete();
        })
        .error(err => {
          this.logger.log(`KC refresh error: ${err}`);
          observer.error();
        });

      return { unsubscribe() { } };
    });
  }

  /**
   * Gets the login URL for keycloak
   *
   * @param {object} options optional object for passing in idpHint, etc.
   * @returns {string} keycloak login url.
   * @memberof KeycloakService
   */
  createLoginUrl(options?: any) {
    return this.keycloakAuth && this.keycloakAuth.createLoginUrl(options);
  }

  /**
   * Tries to log into Keycloak without a login prompt, so we don't
   * show the login screen again when a keycloak session is already active.
   *
   * @param {number} minWaitSeconds min. seconds before another auto login (default 10)
   * @memberof KeycloakService
   */
  tryAutoLogin(minWaitSeconds?: number) {
    if (!this.triedAutoLogin) {
      const cookieExpireSeconds = minWaitSeconds || 10;
      const expireDate = new Date();
      expireDate.setTime(expireDate.getTime() + cookieExpireSeconds * 1000);
      this.cookieService.set(this.AUTOLOGIN_COOKIE_NAME, '1', expireDate, '/');
      // this redirects to Keycloak, but there is no login prompt
      return this.keycloakAuth && this.keycloakAuth.login({ prompt: 'none' });
    }
  }

  /**
   * Checks if the 'KEYCLOAK_TRIED_AUTOLOGIN' cookie exists.
   * By default the cookie expires after 10 seconds unless minWaitSeconds is specified
   *
   * @memberof KeycloakService
   */
  get triedAutoLogin(): boolean {
    return this.cookieService.check(this.AUTOLOGIN_COOKIE_NAME);
  }
}
