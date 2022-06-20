import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { KeycloakService } from 'app/services/keycloak.service';
import { ConfigService } from './config.service';
import { LoggerService } from './logger.service';
import { ToastService } from './toast.service';
import { JwtUtil } from '../shared/utils/jwt-utils';

describe('KeycloakService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KeycloakService, ConfigService, LoggerService, ToastService, HttpClient, HttpHandler]
    });
  });

  it('idp should be `idir` if the token has an idir_userid property', () => {
    spyOn(JwtUtil, 'decodeToken').and.callFake(() => {
      return {
        idir_userid: '12345'
      };
    });
    const keycloak = TestBed.get(KeycloakService);
    spyOn(keycloak, 'getToken').and.callFake(() => {
      return 'not-empty';
    });
    const idp = keycloak.getIdpFromToken();
    expect(idp).toEqual('idir');
  });

  it('idp should be `bceid-basic-and-business` if the token has an bceid_userid property', () => {
    spyOn(JwtUtil, 'decodeToken').and.callFake(() => {
      return {
        bceid_userid: '12345'
      };
    });
    const keycloak = TestBed.get(KeycloakService);
    spyOn(keycloak, 'getToken').and.callFake(() => {
      return 'not-empty';
    });
    const idp = keycloak.getIdpFromToken();
    expect(idp).toEqual('bceid-basic-and-business');
  });

  it('idp should be `bcsc` if the token does not match any known patterns', () => {
    spyOn(JwtUtil, 'decodeToken').and.callFake(() => {
      return {
        preferred_username: 'abc'
      };
    });
    const keycloak = TestBed.get(KeycloakService);
    spyOn(keycloak, 'getToken').and.callFake(() => {
      return 'not-empty';
    });
    const idp = keycloak.getIdpFromToken();
    expect(idp).toEqual('bcsc');
  });
});
