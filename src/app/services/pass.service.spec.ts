import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ConfigService } from './config.service';
import { DataService } from './data.service';
import { EventKeywords, EventObject, EventService } from './event.service';
import { LoadingService } from './loading.service';
import { PassService } from './pass.service';
import { ToastService } from './toast.service';
import { LoggerService } from './logger.service';
import { BehaviorSubject } from 'rxjs';
import { MockData } from '../shared/utils/mock-data';
import { ApiService } from './api.service';
import { Constants } from '../shared/utils/constants';

describe('PassService', () => {
  let service: PassService;

  let mockPassGetRes = new BehaviorSubject({
    data: [MockData.mockPass_1, MockData.mockPass_2],
  });

  let mockQRPassGetRes = new BehaviorSubject({
    data: [MockData.mockPass_1],
  });

  let mockManualLookupPassGetRes = new BehaviorSubject([MockData.mockPass_1]);

  let mockPassAppendRes = new BehaviorSubject({
    data: [MockData.mockPass_1, MockData.mockPass_2],
    LastEvaluatedKey: MockData.mockPassLastEvaluatedKey_1,
  });

  let mockPassGetParams = {
    park: 'Mock Park 1',
    facilityName: 'Mock Facility 1',
    passType: 'AM',
  };

  let mockQRPassGetParams = {
    park: 'Mock Park 1',
    passId: '1234567890',
  };

  let mockManualLookupPassGetParams = {
    date: '2022-12-18',
    park: 'Mock Park 1',
    facilityName: 'Mock Facility 1',
    manualLookup: true,
    firstName: 'FirstName',
  };

  let mockApiService = {
    get: (id, params) => {
      if (id === 'pass') {
        if (params.passType === 'append') {
          return mockPassAppendRes;
        } else if (params.manualLookup) {
          return mockManualLookupPassGetRes;
        } else if (params.park && params.passId) {
          return mockQRPassGetRes;
        }
        return mockPassGetRes;
      }
      return new BehaviorSubject(null);
    },
    delete: (id, params) => {
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
  let apiDeleteSpy;
  let loadingSpy;
  let unloadingSpy;
  let loggerDebugSpy;
  let eventSpy;
  let setDataSpy;
  let appendDataSpy;
  let clearDataSpy;
  let getDataSpy;
  let toastSpy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpClient,
        DataService,
        EventService,
        ToastService,
        HttpHandler,
        { provide: LoggerService, useValue: mockLoggerService },
        ConfigService,
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: ApiService, useValue: mockApiService },
      ],
    });
    service = TestBed.inject(PassService);
    loadingSpy = spyOn(service['loadingService'], 'addToFetchList');
    unloadingSpy = spyOn(service['loadingService'], 'removeToFetchList');
    loggerDebugSpy = spyOn(service['loggerService'], 'debug');
    apiGetSpy = spyOn(service['apiService'], 'get').and.callThrough();
    apiDeleteSpy = spyOn(service['apiService'], 'delete').and.callThrough();
    setDataSpy = spyOn(service['dataService'], 'setItemValue');
    appendDataSpy = spyOn(service['dataService'], 'appendItemValue');
    clearDataSpy = spyOn(service['dataService'], 'clearItemValue');
    getDataSpy = spyOn(service['dataService'], 'getItemValue');
    toastSpy = spyOn(service['toastService'], 'addMessage');
    eventSpy = spyOn(service['eventService'], 'setError');
  });

  it('should be created', async () => {
    expect(service).toBeTruthy();
  });

  it('checks filters', async () => {
    // false
    let mockFilters = {
      facilitySk: 'Mock Facility 1',
    };
    const mockParams = {
      facilitySk: 'Mock Facility 2',
    };
    expect(service.checkFilters(mockFilters, mockParams)).toBeFalse();
    //true
    mockFilters.facilitySk = 'Mock Facility 2';
    expect(service.checkFilters(mockFilters, mockParams)).toBeTrue();
  });

  it('filters search params', async () => {
    // delete items with no value (minimal example)
    const mockParams = {
      park: 'Mock Park 1',
      facilityName: 'Mock Facility 1',
    };
    const res = service.filterSearchParams(mockParams);
    expect(Object.keys(res).length).toEqual(2);
  });

  it('sets the filter from the url', async () => {
    const fetchDataSpy = spyOn(service, 'fetchData');
    // no params in url
    let noParams = service.setParamsFromUrl(MockData.mockFacility_1);
    expect(fetchDataSpy).toHaveBeenCalledTimes(1);
    expect(Object.keys(noParams).length).toEqual(5);
    fetchDataSpy.calls.reset();
    // params in the url
    let params = service.setParamsFromUrl(MockData.mockFacility_1, {
      // no spaces in url
      passStatus: 'active,reserved',
    });
    expect(fetchDataSpy).toHaveBeenCalledTimes(1);
    expect(Object.keys(params).length).toEqual(3);
    expect(params['passStatus']).toEqual(['active', 'reserved']);
  });

  it('fetches passes', async () => {
    await service.fetchData(mockPassGetParams);
    expect(loadingSpy).toHaveBeenCalledTimes(1);
    expect(apiGetSpy).toHaveBeenCalledOnceWith('pass', mockPassGetParams);
    expect(setDataSpy).toHaveBeenCalledWith(
      Constants.dataIds.PASSES_LIST,
      mockPassGetRes.value.data
    );
    expect(clearDataSpy).toHaveBeenCalledWith(
      Constants.dataIds.PASS_LAST_EVALUATED_KEY
    );
    expect(setDataSpy).toHaveBeenCalledWith(
      Constants.dataIds.PASS_SEARCH_PARAMS,
      mockPassGetParams
    );
    expect(unloadingSpy).toHaveBeenCalledTimes(1);
  });

  it('fetches passes and appends them to existing pass list', async () => {
    let mockPassAppendParams = { ...mockPassGetParams, appendResults: true };
    mockPassAppendParams.passType = 'append';
    await service.fetchData(mockPassAppendParams);
    expect(loadingSpy).toHaveBeenCalledTimes(1);
    delete mockPassAppendParams.appendResults;
    expect(apiGetSpy).toHaveBeenCalledOnceWith('pass', mockPassAppendParams);
    expect(appendDataSpy).toHaveBeenCalledWith(
      Constants.dataIds.PASSES_LIST,
      mockPassGetRes.value.data
    );
    expect(setDataSpy).toHaveBeenCalledWith(
      Constants.dataIds.PASS_LAST_EVALUATED_KEY,
      mockPassAppendRes.value.LastEvaluatedKey
    );
    expect(setDataSpy).toHaveBeenCalledWith(
      Constants.dataIds.PASS_SEARCH_PARAMS,
      mockPassAppendParams
    );
    expect(unloadingSpy).toHaveBeenCalledTimes(1);
  });

  it('throws error when pass get fails', async () => {
    // throw error
    loadingSpy.and.throwError('get error');
    await service.fetchData(mockPassGetParams);
    expect(toastSpy).toHaveBeenCalledTimes(1);
    expect(eventSpy).toHaveBeenCalledOnceWith(
      new EventObject(EventKeywords.ERROR, 'Error: get error', 'Pass Service')
    );
    expect(unloadingSpy).toHaveBeenCalledTimes(1);
  });

  it('cancels passes', async () => {
    let mockCancelPassId: '1234567890';
    let mockCancelPassParkSk: 'Mock Park 1';
    const fetchDataSpy = spyOn(service, 'fetchData');
    await service.cancelPasses(mockCancelPassId, mockCancelPassParkSk);
    expect(loadingSpy).toHaveBeenCalledTimes(1);
    expect(loggerDebugSpy).toHaveBeenCalledTimes(1);
    expect(apiDeleteSpy).toHaveBeenCalledOnceWith('pass', {
      passId: mockCancelPassId,
      park: mockCancelPassParkSk,
    });
    expect(setDataSpy).toHaveBeenCalledOnceWith(
      Constants.dataIds.CANCELLED_PASS,
      true
    );
    expect(getDataSpy).toHaveBeenCalledOnceWith(
      Constants.dataIds.PASS_SEARCH_PARAMS
    );
    expect(fetchDataSpy).toHaveBeenCalledTimes(1);
    expect(unloadingSpy).toHaveBeenCalledTimes(1);
  });

  it('throws error when pass cancel fails', async () => {
    // throw error
    loadingSpy.and.throwError('delete error');
    await service.cancelPasses('mockId', 'mockParkSk');
    expect(toastSpy).toHaveBeenCalledTimes(1);
    expect(eventSpy).toHaveBeenCalledOnceWith(
      new EventObject(
        EventKeywords.ERROR,
        'Error: delete error',
        'Pass Service'
      )
    );
    expect(unloadingSpy).toHaveBeenCalledTimes(1);
  });

  // Pass management
  it('finds pass with QR code params', async () => {
    await service.fetchData(mockQRPassGetParams);
    expect(loadingSpy).toHaveBeenCalledTimes(1);
    expect(apiGetSpy).toHaveBeenCalledOnceWith('pass', mockQRPassGetParams);
    expect(setDataSpy).toHaveBeenCalledWith(
      Constants.dataIds.PASS_CHECK_IN_LIST,
      mockQRPassGetRes.value.data
    );
    expect(unloadingSpy).toHaveBeenCalledTimes(1);
  });

  it('finds passes with manual lookup flag set', async () => {
    await service.fetchData(mockManualLookupPassGetParams);
    expect(loadingSpy).toHaveBeenCalledTimes(1);
    expect(apiGetSpy).toHaveBeenCalledOnceWith(
      'pass',
      mockManualLookupPassGetParams
    );
    expect(setDataSpy).toHaveBeenCalledWith(
      Constants.dataIds.PASS_CHECK_IN_LIST,
      mockManualLookupPassGetRes.value
    );
    expect(unloadingSpy).toHaveBeenCalledTimes(1);
  });
});
