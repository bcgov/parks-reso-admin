import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ConfigService } from './config.service';
import { DataService } from './data.service';
import { EventKeywords, EventObject, EventService } from './event.service';
import { LoadingService } from './loading.service';
import { ParkService } from './park.service';
import { ToastService } from './toast.service';
import { LoggerService } from './logger.service';
import { BehaviorSubject } from 'rxjs';
import { MockData } from '../shared/utils/mock-data';
import { ApiService } from './api.service';
import { Constants } from '../shared/utils/constants';

describe('ParkService', () => {
  let service: ParkService;

  let mockParkRes = new BehaviorSubject([MockData.mockPark_1]);

  let mockParksListRes = new BehaviorSubject([
    MockData.mockPark_1,
    MockData.mockPark_2,
  ]);

  let mockParkObj = {
    pk: 'park',
    sk: 'MOC1',
    park: {
      name: 'Mock Park 1',
      orcs: 'MOC1',
    },
  };

  let mockEmptyModifierObj = {
    date: '2022-12-28',
    bookingTimes: {
      AM: 0,
      PM: 0,
      DAY: 0,
    },
    parkName: 'Mock Park 1',
    facility: 'MOC1',
  };

  let mockApiService = {
    get: (id, params) => {
      if (id === 'park') {
        if (params) {
          // return specific park
          return mockParkRes;
        }
        // return all parks
        return mockParksListRes;
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
        DataService,
        EventService,
        ToastService,
        { provide: LoggerService, useValue: mockLoggerService },
        HttpHandler,
        ConfigService,
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: ApiService, useValue: mockApiService },
      ],
    });
    service = TestBed.inject(ParkService);
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

  it('fetches all parks', async () => {
    await service.fetchData();
    expect(loadingSpy).toHaveBeenCalledTimes(1);
    expect(loggerDebugSpy).toHaveBeenCalledTimes(1);
    expect(apiGetSpy).toHaveBeenCalledOnceWith('park');
    expect(setDataSpy).toHaveBeenCalledOnceWith(
      Constants.dataIds.PARKS_LIST,
      mockParksListRes.value
    );
    expect(unloadingSpy).toHaveBeenCalledTimes(1);
  });

  it('fetches specific park', async () => {
    await service.fetchData('Mock Park 1');
    expect(loadingSpy).toHaveBeenCalledTimes(1);
    expect(loggerDebugSpy).toHaveBeenCalledTimes(1);
    expect(apiGetSpy).toHaveBeenCalledOnceWith('park', { park: 'Mock Park 1' });
    expect(setDataSpy).toHaveBeenCalledOnceWith(
      Constants.dataIds.CURRENT_PARK,
      mockParkRes.value[0]
    );
    expect(unloadingSpy).toHaveBeenCalledTimes(1);
  });

  it('throws error when park get fails', async () => {
    // throw error
    loadingSpy.and.throwError('get error');
    await service.fetchData();
    expect(toastSpy).toHaveBeenCalledTimes(1);
    expect(eventSpy).toHaveBeenCalledOnceWith(
      new EventObject(EventKeywords.ERROR, 'Error: get error', 'Park Service')
    );
    expect(setDataSpy).toHaveBeenCalledOnceWith(
      Constants.dataIds.PARKS_LIST,
      'error'
    );
    expect(unloadingSpy).toHaveBeenCalledTimes(1);
  });

  it('puts park object', async () => {
    const fetchSpy = spyOn(service, 'fetchData');
    await service.putPark(mockParkObj);
    expect(loadingSpy).toHaveBeenCalledTimes(1);
    expect(loggerDebugSpy).toHaveBeenCalledTimes(1);
    expect(apiPutSpy).toHaveBeenCalledOnceWith('park', mockParkObj);
    expect(unloadingSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledOnceWith('MOC1');
    expect(toastSpy).toHaveBeenCalledTimes(1);
  });

  it('throws error if park put fails', async () => {
    // throw error
    loadingSpy.and.throwError('put error');
    await service.putPark(mockParkObj);
    expect(toastSpy).toHaveBeenCalledTimes(1);
    expect(eventSpy).toHaveBeenCalledOnceWith(
      new EventObject(EventKeywords.ERROR, 'Error: put error', 'Park Service')
    );
    expect(unloadingSpy).toHaveBeenCalledTimes(1);
  });
});
