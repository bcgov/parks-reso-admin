import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { KeycloakService } from './keycloak.service';
import { ConfigService } from './config.service';
import { LoggerService } from './logger.service';
import { ToastService } from './toast.service';
import { JwtUtil } from '../shared/utils/jwt-utils';
import { of, throwError } from 'rxjs';

describe('KeycloakService', () => {
  let keycloak: KeycloakService;
  let configService: ConfigService;
  let loggerService: LoggerService;
  let toastService: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        KeycloakService,
        ConfigService,
        LoggerService,
        ToastService,
        HttpClient,
        HttpHandler,
      ],
    });
    keycloak = TestBed.inject(KeycloakService);
    configService = TestBed.inject(ConfigService);
    loggerService = TestBed.inject(LoggerService);
    toastService = TestBed.inject(ToastService);
  });

  it('idp should be `idir` if the token has an idir_userid property', () => {
    spyOn(JwtUtil, 'decodeToken').and.callFake(() => {
      return {
        idir_user_guid: '12345',
      };
    });
    spyOn(keycloak, 'getToken').and.callFake(() => {
      return 'not-empty';
    });
    const idp = keycloak.getIdpFromToken();
    expect(idp).toEqual('idir');
  });

  it('idp should be `bceid` if the token has an bceid_userid property', () => {
    spyOn(JwtUtil, 'decodeToken').and.callFake(() => {
      return {
        bceid_userid: '12345',
      };
    });
    spyOn(keycloak, 'getToken').and.callFake(() => {
      return 'not-empty';
    });
    const idp = keycloak.getIdpFromToken();
    expect(idp).toEqual('bceid');
  });

  it('idp should be `bcsc` if the token does not match any known patterns', () => {
    spyOn(JwtUtil, 'decodeToken').and.callFake(() => {
      return {
        preferred_username: 'abc',
      };
    });
    spyOn(keycloak, 'getToken').and.callFake(() => {
      return 'not-empty';
    });
    const idp = keycloak.getIdpFromToken();
    expect(idp).toEqual('bcsc');
  });

  it('getIdpFromToken should return empty string if no token', () => {
    spyOn(keycloak, 'getToken').and.returnValue('');
    const idp = keycloak.getIdpFromToken();
    expect(idp).toBe('');
  });

  it('isAuthenticated should return false if no token', () => {
    spyOn(keycloak, 'getToken').and.returnValue('');
    keycloak['keycloakAuth'] = { authenticated: true };
    expect(keycloak.isAuthenticated()).toBe(false);
  });

  it('isAuthenticated should return true if authenticated and token exists', () => {
    spyOn(keycloak, 'getToken').and.returnValue('token');
    keycloak['keycloakAuth'] = { authenticated: true };
    expect(keycloak.isAuthenticated()).toBe(true);
  });

  it('isAuthenticated should return false if not authenticated', () => {
    spyOn(keycloak, 'getToken').and.returnValue('token');
    keycloak['keycloakAuth'] = { authenticated: false };
    expect(keycloak.isAuthenticated()).toBe(false);
  });

  it('isAuthorized should return false if no token', () => {
    spyOn(keycloak, 'getToken').and.returnValue('');
    expect(keycloak.isAuthorized()).toBe(false);
  });

  it('isAuthorized should return false if jwt.resource_access is missing', () => {
    spyOn(keycloak, 'getToken').and.returnValue('token');
    spyOn(JwtUtil, 'decodeToken').and.returnValue({});
    expect(keycloak.isAuthorized()).toBe(false);
  });

  it('isAuthorized should return true if roles exist and no specificRoles', () => {
    spyOn(keycloak, 'getToken').and.returnValue('token');
    spyOn(JwtUtil, 'decodeToken').and.returnValue({
      resource_access: {
        'parking-pass': { roles: ['admin'] }
      }
    });
    expect(keycloak.isAuthorized()).toBe(true);
  });

  it('isAuthorized should return true if specificRoles are present', () => {
    spyOn(keycloak, 'getToken').and.returnValue('token');
    spyOn(JwtUtil, 'decodeToken').and.returnValue({
      resource_access: {
        'parking-pass': { roles: ['admin', 'user'] }
      }
    });
    expect(keycloak.isAuthorized(['admin'])).toBe(true);
  });

  it('isAuthorized should return false if specificRoles are missing', () => {
    spyOn(keycloak, 'getToken').and.returnValue('token');
    spyOn(JwtUtil, 'decodeToken').and.returnValue({
      resource_access: {
        'parking-pass': { roles: ['user'] }
      }
    });
    expect(keycloak.isAuthorized(['admin'])).toBe(false);
  });

  it('isAllowed should return true for services not restricted', () => {
    expect(keycloak.isAllowed('some-other-service')).toBe(true);
  });

  it('isAllowed should return false if no token for restricted service', () => {
    spyOn(keycloak, 'getToken').and.returnValue('');
    expect(keycloak.isAllowed('export-reports')).toBe(false);
  });

  it('isAllowed should return true if sysadmin role present', () => {
    spyOn(keycloak, 'getToken').and.returnValue('token');
    spyOn(JwtUtil, 'decodeToken').and.returnValue({
      resource_access: {
        'parking-pass': { roles: ['sysadmin'] }
      }
    });
    expect(keycloak.isAllowed('export-reports')).toBe(true);
  });

  it('isAllowed should return false if sysadmin role missing', () => {
    spyOn(keycloak, 'getToken').and.returnValue('token');
    spyOn(JwtUtil, 'decodeToken').and.returnValue({
      resource_access: {
        'parking-pass': { roles: ['user'] }
      }
    });
    expect(keycloak.isAllowed('export-reports')).toBe(false);
  });

  it('getToken should return undefined if keycloakAuth is not set', () => {
    keycloak['keycloakAuth'] = undefined;
    expect(keycloak.getToken()).toBeUndefined();
  });

  it('refreshToken should emit refreshed value and complete', (done) => {
    keycloak['keycloakAuth'] = {
      updateToken: () => Promise.resolve(true)
    };
    spyOn(loggerService, 'log');
    keycloak.refreshToken().subscribe({
      next: (refreshed) => {
        expect(refreshed).toBe(true);
        done();
      }
    });
  });

  it('refreshToken should emit error if updateToken fails', (done) => {
    keycloak['keycloakAuth'] = {
      updateToken: () => Promise.reject('fail')
    };
    spyOn(loggerService, 'log');
    keycloak.refreshToken().subscribe({
      error: () => {
        expect(loggerService.log).toHaveBeenCalled();
        done();
      }
    });
  });

  it('getWelcomeMessage should return empty string if no token', () => {
    spyOn(keycloak, 'getToken').and.returnValue('');
    expect(keycloak.getWelcomeMessage()).toBe('');
  });

  it('getWelcomeMessage should return empty string if jwt.name missing', () => {
    spyOn(keycloak, 'getToken').and.returnValue('token');
    spyOn(JwtUtil, 'decodeToken').and.returnValue({});
    expect(keycloak.getWelcomeMessage()).toBe('');
  });

  it('getWelcomeMessage should return name if present', () => {
    spyOn(keycloak, 'getToken').and.returnValue('token');
    spyOn(JwtUtil, 'decodeToken').and.returnValue({ name: 'Test User' });
    expect(keycloak.getWelcomeMessage()).toBe('Test User');
  });

  it('login should call keycloakAuth.login with correct params', () => {
    keycloak['keycloakAuth'] = { login: jasmine.createSpy('login') };
    spyOnProperty(configService, 'config', 'get').and.returnValue({ REDIRECT_KEY: 'REDIRECT_KEY' });
    spyOn(localStorage, 'getItem').and.returnValue('http://localhost/login');
    keycloak.login('idir');
    expect(keycloak['keycloakAuth'].login).toHaveBeenCalledWith({
      idpHint: 'idir',
      redirectUri: 'http://localhost'
    });
  });

  it('login should use window.location.href if REDIRECT_KEY not set', () => {
    keycloak['keycloakAuth'] = { login: jasmine.createSpy('login') };
    spyOnProperty(configService, 'config', 'get').and.returnValue({ REDIRECT_KEY: 'REDIRECT_KEY' });
    spyOn(localStorage, 'getItem').and.returnValue(null);
    
    // Since we can't mock window.location, we'll test with the actual current location
    // and verify that the login method is called with the current href
    const currentHref = window.location.href;
    
    keycloak.login('idir');
    expect(keycloak['keycloakAuth'].login).toHaveBeenCalledWith({
      idpHint: 'idir',
      redirectUri: currentHref
    });
  });
});
