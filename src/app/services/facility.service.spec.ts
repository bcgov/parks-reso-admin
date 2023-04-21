import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ConfigService } from './config.service';
import { DataService } from './data.service';
import { EventKeywords, EventObject, EventService } from './event.service';

import { FacilityService } from './facility.service';
import { LoadingService } from './loading.service';
import { ToastService } from './toast.service';
import { LoggerService } from './logger.service';
import { BehaviorSubject } from 'rxjs';
import { MockData } from '../shared/utils/mock-data';
import { ApiService } from './api.service';
import { Constants } from '../shared/utils/constants';

describe('FacilityService', () => {
  let service: FacilityService;

  let mockFacility1 = MockData.mockFacility_1;
  let mockFacility2 = MockData.mockFacility_2;

  let parkFacilitiesRes = new BehaviorSubject([
    mockFacility1,
    mockFacility2,
  ]);

  let specificFacilityRes = new BehaviorSubject([MockData.mockFacility_1]);

  let mockFacilityPostObj = {
    pk: 'facility::Mock Park 1',
    sk: 'Mock Facility 1',
    parkName: 'Mock Park 1',
    name: 'Mock Facility 1',
  };

  let mockApiService = {
    get: (id, params) => {
      if (id === 'facility') {
        if (params && params.park && params.facilities) {
          if (params.park === 'error') {
            // throw error
            throw 'get error';
          }
          // We want all facilities from a single park
          return parkFacilitiesRes;
        }
        if (params && params.facilityName && params.park) {
          // We want specific facility
          return specificFacilityRes;
        }
      }
      return new BehaviorSubject(null);
    },
    put(id, params) {
      if (id === 'facility') {
        return new BehaviorSubject('facilityPut');
      }
      return new BehaviorSubject(null);
    },
    post(id, params) {
      if (id === 'facility') {
        return new BehaviorSubject('facilityPost');
      }
      return new BehaviorSubject(null);
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

  let loadingSpy;
  let unloadingSpy;
  let loggerDebugSpy;
  let apiGetSpy;
  let apiPutSpy;
  let apiPostSpy;
  let setDataSpy;
  let toastSpy;
  let eventSpy;

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
    service = TestBed.inject(FacilityService);
    loadingSpy = spyOn(service['loadingService'], 'addToFetchList');
    unloadingSpy = spyOn(service['loadingService'], 'removeToFetchList');
    loggerDebugSpy = spyOn(service['loggerService'], 'debug');
    apiGetSpy = spyOn(service['apiService'], 'get').and.callThrough();
    apiPutSpy = spyOn(service['apiService'], 'put').and.callThrough();
    apiPostSpy = spyOn(service['apiService'], 'post').and.callThrough();
    setDataSpy = spyOn(service['dataService'], 'setItemValue');
    toastSpy = spyOn(service['toastService'], 'addMessage');
    eventSpy = spyOn(service['eventService'], 'setError');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('fetches all facilities from specific park', async () => {
    await service.fetchData('Mock Park 1');
    expect(loadingSpy).toHaveBeenCalledTimes(1);
    expect(loggerDebugSpy).toHaveBeenCalledTimes(1);
    expect(apiGetSpy).toHaveBeenCalledOnceWith('facility', {
      facilities: true,
      park: 'Mock Park 1',
    });
    expect(setDataSpy).toHaveBeenCalledOnceWith(
      Constants.dataIds.FACILITIES_LIST,
      parkFacilitiesRes.value
    );
    expect(unloadingSpy).toHaveBeenCalledTimes(1);
  });

  it('fetches specific facility from specific park', async () => {
    await service.fetchData('Mock Park 1', 'Mock Facility 1');
    expect(loadingSpy).toHaveBeenCalledTimes(1);
    expect(apiGetSpy).toHaveBeenCalledOnceWith('facility', {
      facilityName: 'Mock Facility 1',
      park: 'Mock Park 1',
    });
    expect(setDataSpy).toHaveBeenCalledOnceWith(
      Constants.dataIds.CURRENT_FACILITY_KEY,
      { pk: mockFacility1.pk, sk: mockFacility1.sk }
    );
    expect(unloadingSpy).toHaveBeenCalledTimes(1);
  });

  it('throws error when facility get fails', async () => {
    await service.fetchData('error');
    expect(eventSpy).toHaveBeenCalledOnceWith(
      new EventObject(EventKeywords.ERROR, 'get error', 'Facility Service')
    );
    expect(setDataSpy).toHaveBeenCalledOnceWith(
      Constants.dataIds.FACILITIES_LIST,
      'error'
    );
  });

  it('puts facility', async () => {
    await service.putFacility(mockFacilityPostObj, 'Mock Park 1');
    expect(loadingSpy).toHaveBeenCalledTimes(1);
    expect(loggerDebugSpy).toHaveBeenCalledTimes(1);
    expect(apiPutSpy).toHaveBeenCalledOnceWith('facility', mockFacilityPostObj);
    expect(toastSpy).toHaveBeenCalledTimes(1);
    expect(unloadingSpy).toHaveBeenCalledTimes(1);
  });

  it('throws error when facility put fails', async () => {
    const fetchDataSpy = spyOn(service, 'fetchData');
    await service.putFacility(mockFacilityPostObj, null);
    expect(eventSpy).toHaveBeenCalledOnceWith(
      new EventObject(
        EventKeywords.ERROR,
        'Must provide a park.',
        'Facility Service'
      )
    );
  });

  it('posts facility', async () => {
    await service.postFacility(mockFacilityPostObj, 'Mock Park 1');
    expect(loadingSpy).toHaveBeenCalledTimes(1);
    expect(loggerDebugSpy).toHaveBeenCalledTimes(1);
    expect(apiPostSpy).toHaveBeenCalledOnceWith(
      'facility',
      mockFacilityPostObj
    );
    expect(toastSpy).toHaveBeenCalledTimes(1);
    expect(unloadingSpy).toHaveBeenCalledTimes(1);
  });

  it('throws error when facility post fails', async () => {
    const fetchDataSpy = spyOn(service, 'fetchData');
    await service.postFacility(mockFacilityPostObj, null);
    expect(eventSpy).toHaveBeenCalledOnceWith(
      new EventObject(
        EventKeywords.ERROR,
        'Must provide a park.',
        'Facility Service'
      )
    );
  });

  it('gets facility by key', async () => {
    spyOn(service['dataService'], 'getItemValue').and.callFake((dataId) => {
      if (dataId === Constants.dataIds.PARK_AND_FACILITY_LIST) {
        return {
          MOC1: {
            facilities: {
              "Mock Facility 1": mockFacility1
            }
          }
        }
      }
      if (dataId === Constants.dataIds.CURRENT_FACILITY_KEY) {
        return { pk: mockFacility1.pk, sk: mockFacility1.sk }
      }
      return null;
    });
    expect(service.getCachedFacility({ pk: mockFacility1.pk, sk: mockFacility1.sk })).toEqual(mockFacility1);
    expect(service.getCurrentFacility()).toEqual(mockFacility1);
  });
});
