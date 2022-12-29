import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ConfigService } from './config.service';

import { ModifierService } from './modifier.service';
import { LoggerService } from './logger.service';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { LoadingService } from './loading.service';
import { Constants } from '../shared/utils/constants';
import { MockData } from '../shared/utils/mock-data';
import { EventKeywords, EventObject } from './event.service';

describe('ModifierService', () => {
  let service: ModifierService;

  let mockReservationRes = new BehaviorSubject([MockData.mockReservationObj_1]);

  let mockReservationGetParams = {
    park: 'Mock Park 1',
    facility: 'Mock Facility 1',
    date: '2022-12-28',
    getFutureReservationObjects: true,
  };

  let mockEmptyModifierObj = {
    date: '2022-12-28',
    bookingTimes: {
      AM: 0,
      PM: 0,
      DAY: 0,
    },
    parkName: 'Mock Park 1',
    facility: 'Mock Facility 1',
  };

  let mockApiService = {
    get: (id, params) => {
      if (id === 'reservation') {
        return mockReservationRes;
      }
      return new BehaviorSubject(null);
    },
    put: (id, params) => {
      return new BehaviorSubject(true);
    },
  };

  let mockLoadingService = {
    addToFetchList: (dataTag) => {
      return dataTag;
    },
    removeToFetchList: (dataTag) => {
      return dataTag;
    },
  };

  let mockLoggerService = {
    debug: () => {
      return true;
    },
    error: () => {
      return true;
    },
  };

  let apiGetSpy;
  let apiPutSpy;
  let loadingSpy;
  let unloadingSpy;
  let loggerDebugSpy;
  let eventSpy;
  let setDataSpy;
  let toastSpy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpClient,
        HttpHandler,
        ConfigService,
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: ApiService, useValue: mockApiService },
      ],
    });
    service = TestBed.inject(ModifierService);
    // service['utils'] = new Utils();
    loadingSpy = spyOn(service['loadingService'], 'addToFetchList');
    unloadingSpy = spyOn(service['loadingService'], 'removeToFetchList');
    loggerDebugSpy = spyOn(service['loggerService'], 'debug');
    apiGetSpy = spyOn(service['apiService'], 'get').and.callThrough();
    apiPutSpy = spyOn(service['apiService'], 'put').and.callThrough();
    setDataSpy = spyOn(service['dataService'], 'setItemValue');
    toastSpy = spyOn(service['toastService'], 'addMessage');
    eventSpy = spyOn(service['eventService'], 'setError');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('fetches reservation objects', async () => {
    await service.fetchData('Mock Park 1', 'Mock Facility 1', '2022-12-28');
    expect(loadingSpy).toHaveBeenCalledTimes(1);
    expect(loggerDebugSpy).toHaveBeenCalledTimes(1);
    expect(apiGetSpy).toHaveBeenCalledOnceWith(
      'reservation',
      mockReservationGetParams
    );
    expect(setDataSpy).toHaveBeenCalledOnceWith(Constants.dataIds.MODIFIERS, [
      MockData.mockReservationObj_1,
    ]);
    expect(unloadingSpy).toHaveBeenCalledTimes(1);
  });

  it('throws an error if reservation get fails', async () => {
    // throw error
    loadingSpy.and.throwError('get error');
    await service.fetchData('Mock Park 1', 'Mock Facility 1', '2022-12-28');
    expect(toastSpy).toHaveBeenCalledTimes(1);
    expect(eventSpy).toHaveBeenCalledOnceWith(
      new EventObject(
        EventKeywords.ERROR,
        'Error: get error',
        'Modifier Service'
      )
    );
    expect(unloadingSpy).toHaveBeenCalledTimes(1);
  });

  it('puts reservation objects', async () => {
    const fetchDataSpy = spyOn(service, 'fetchData');
    await service.setModifier(MockData.mockReservationObj_1);
    expect(loggerDebugSpy).toHaveBeenCalledTimes(1);
    expect(apiPutSpy).toHaveBeenCalledOnceWith(
      'modifier',
      MockData.mockReservationObj_1
    );
    expect(fetchDataSpy).toHaveBeenCalledTimes(1);
    expect(toastSpy).toHaveBeenCalledTimes(1);
  });

  it('throws error when put reservation fails', async () => {
    // throw error
    loggerDebugSpy.and.throwError('put error');
    await service.setModifier(MockData.mockReservationObj_1);
    expect(toastSpy).toHaveBeenCalledTimes(1);
    expect(eventSpy).toHaveBeenCalledOnceWith(
      new EventObject(
        EventKeywords.ERROR,
        'Error: put error',
        'Modifier Service'
      )
    );
  });

  it('deletes (resets) reservation objects', async () => {
    // delete is actually an api put, resetting everything.
    const fetchDataSpy = spyOn(service, 'fetchData');
    await service.deleteModifier(
      'Mock Park 1',
      'Mock Facility 1',
      '2022-12-28'
    );
    expect(loggerDebugSpy).toHaveBeenCalledTimes(1);
    expect(apiPutSpy).toHaveBeenCalledOnceWith(
      'modifier',
      mockEmptyModifierObj
    );
    expect(fetchDataSpy).toHaveBeenCalledTimes(1);
    expect(toastSpy).toHaveBeenCalledTimes(1);
  });

  it('throws error if reservation delete fails', async () => {
    // throw error
    loggerDebugSpy.and.throwError('delete error');
    await service.deleteModifier(
      'Mock Park 1',
      'Mock Facility 1',
      '2022-12-28'
    );
    expect(toastSpy).toHaveBeenCalledTimes(1);
    expect(eventSpy).toHaveBeenCalledOnceWith(
      new EventObject(
        EventKeywords.ERROR,
        'Error: delete error',
        'Modifier Service'
      )
    );
  });
});
