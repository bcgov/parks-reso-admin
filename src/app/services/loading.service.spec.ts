import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from './config.service';
import { LoadingService } from './loading.service';
import { LoggerService } from './logger.service';

describe('LoadingService', () => {
  let service: LoadingService;

  let mockFetchList = new BehaviorSubject({});

  mockFetchList.next({
    id1: 'value1',
    id2: 'value2',
  });

  let mockLoggerService = {
    debug: () => {
      return 'debug';
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: LoggerService, useValue: mockLoggerService },
        HttpClient,
        ConfigService,
        HttpHandler,
      ],
    });
    service = TestBed.inject(LoadingService);
    service['fetchList'] = mockFetchList;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service['fetchList']).toBeDefined();
  });

  it('adds id to fetch list', async () => {
    const updateSpy = spyOn(service, 'updateLoadingStatus');
    service.addToFetchList('id1');
    expect(service['fetchList'].value['id1']).toEqual({ loading: true });
    expect(updateSpy).toHaveBeenCalledTimes(1);
  });

  it('removes id to fetch list', async () => {
    const updateSpy = spyOn(service, 'updateLoadingStatus');
    service.removeToFetchList('id1');
    expect(service['fetchList'].value['id1']).toBeUndefined();
    expect(updateSpy).toHaveBeenCalledTimes(1);
  });

  it('updates the loading status', async () => {
    // theres items in the fetch list
    service.updateLoadingStatus();
    expect(service['loading'].value).toBeTrue();
    // the fetch list is empty
    service['fetchList'] = new BehaviorSubject({});
    service.updateLoadingStatus();
    expect(service['loading'].value).toBeFalse();
  });

  it('gets fetch list', async () => {
    expect(service.getFetchList()).toEqual(mockFetchList.asObservable());
  });

  it('gets loading state', async () => {
    // clear list and expect loading to be false
    service['fetchList'] = new BehaviorSubject({});
    service.updateLoadingStatus();
    expect(service.getLoadingStatus()).toEqual(
      new BehaviorSubject(false).asObservable()
    );
  });
});
