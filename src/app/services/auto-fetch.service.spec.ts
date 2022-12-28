import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AutoFetchService } from './auto-fetch.service';
import { ConfigService } from './config.service';
import { LoggerService } from './logger.service';

describe('AutoFetchService', () => {
  let service: AutoFetchService;

  let mockLoggerService = {
    debug: (str) => {
      return 'debug';
    },
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        HttpClient,
        HttpHandler,
        ConfigService,
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    });
    service = TestBed.inject(AutoFetchService);
    service.timeIntevalSeconds = 1;
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.fetchQueue).toBeDefined();
  });

  it('fetches the queue', async () => {
    const fetchSpy = spyOn(service, 'runFetches').and.callThrough();
    const parkSpy = spyOn(service['parkService'], 'fetchData');
    await service.run();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(parkSpy).toHaveBeenCalledTimes(1);
    jasmine.clock().tick(1001);
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(parkSpy).toHaveBeenCalledTimes(2);
  });
});
