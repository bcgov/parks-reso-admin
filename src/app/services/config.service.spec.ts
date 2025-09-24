import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import * as rxjs from 'rxjs';

import { ConfigService } from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    TestBed.configureTestingModule({
      providers: [
        ConfigService,
        { provide: HttpClient, useValue: httpClientSpy },
        HttpHandler,
      ],
    });
    service = TestBed.inject(ConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize configuration from window.__env', async () => {
    (window as any).__env = { foo: 'bar', configEndpoint: false };
    await service.init();
    expect(service.config.foo).toBe('bar');
  });

  it('should fetch configuration from /api/config if configEndpoint is true', async () => {
    (window as any).__env = { configEndpoint: true };
    const apiConfig = { foo: 'baz', logLevel: 1 };
    
    // Mock the HTTP call to return an Observable
    httpClientSpy.get.and.returnValue(of(apiConfig));
    
    await service.init();
    expect(service.config.foo).toBe('baz');
    expect(httpClientSpy.get).toHaveBeenCalledWith('/api/config');
  });

  it('should log configuration if logLevel is 0', async () => {
    (window as any).__env = { logLevel: 0, configEndpoint: false };
    spyOn(console, 'log');
    await service.init();
    expect(console.log).toHaveBeenCalledWith('Configuration:', service.config);
  });

  it('should handle error when fetching config from /api/config', async () => {
    (window as any).__env = { configEndpoint: true, foo: 'bar' };
    
    // Mock the HTTP call to return an error Observable
    httpClientSpy.get.and.returnValue(throwError(() => new Error('API Error')));
    
    spyOn(console, 'error');
    await service.init();
    expect(console.error).toHaveBeenCalled();
    expect(service.config.foo).toBe('bar');
    expect(httpClientSpy.get).toHaveBeenCalledWith('/api/config');
  });

  it('logLevel getter should return value from window.__env', () => {
    (window as any).__env = { logLevel: 2 };
    expect(service.logLevel).toBe(2);
  });

  it('config getter should return configuration', () => {
    (service as any).configuration = { test: 123 };
    expect(service.config).toEqual({ test: 123 });
  });
});
