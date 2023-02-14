import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ConfigService } from './config.service';
import { ReservationService } from './reservation.service';
import { LoggerService } from './logger.service';
import { MockData } from '../shared/utils/mock-data';
import { Constants } from '../shared/utils/constants';
import { LoadingService } from './loading.service';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { EventKeywords, EventObject } from './event.service';

describe('ReservationService', () => {
  let service: ReservationService;

  let mockReservationGetRes = new BehaviorSubject([
    MockData.mockReservationObj_1,
  ]);

  let mockApiService = {
    get: (id, params) => {
      if (id === 'reservation') {
        if (params.park === 'noResObj') {
          return new BehaviorSubject([]);
        }
        return mockReservationGetRes;
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

  let apiGetSpy;
  let loadingSpy;
  let unloadingSpy;
  let loggerDebugSpy;
  let eventSpy;
  let setDataSpy;
  let getDataSpy;
  let toastSpy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpClient,
        HttpHandler,
        ConfigService,
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: ApiService, useValue: mockApiService },
      ],
    });
    service = TestBed.inject(ReservationService);
    loadingSpy = spyOn(service['loadingService'], 'addToFetchList');
    unloadingSpy = spyOn(service['loadingService'], 'removeToFetchList');
    loggerDebugSpy = spyOn(service['loggerService'], 'debug');
    apiGetSpy = spyOn(service['apiService'], 'get').and.callThrough();
    setDataSpy = spyOn(service['dataService'], 'setItemValue');
    getDataSpy = spyOn(service['dataService'], 'getItemValue').and.returnValue(
      MockData.mockFacility_1,
    );
    toastSpy = spyOn(service['toastService'], 'addMessage');
    eventSpy = spyOn(service['eventService'], 'setError');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('calculates the progress bar colour', async () => {
    expect(service.calculateProgressBarColour(24)).toEqual('success');
    expect(service.calculateProgressBarColour(25)).toEqual('warning');
    expect(service.calculateProgressBarColour(75)).toEqual('danger');
  });

  it('sets the capacity bar', async () => {
    // expected res object from mockReservationObj_1
    const expectedCapBarObj = {
      capPercent: 0,
      reserved: 0,
      capacity: 13,
      overbooked: 0,
      modifier: 8,
      style: 'success',
    };
    service.setCapacityBar(MockData.mockReservationObj_1, 'AM');
    expect(setDataSpy).toHaveBeenCalledOnceWith(
      Constants.dataIds.CURRENT_CAPACITY_BAR_OBJECT,
      expectedCapBarObj
    );
  });

  it('initializes reservation data', async () => {
    await service.fetchData('Mock Park 1', 'Mock Facility 1');
    expect(apiGetSpy).not.toHaveBeenCalled();
    expect(setDataSpy).toHaveBeenCalledWith(
      Constants.dataIds.CURRENT_CAPACITY_BAR_OBJECT,
      {
        capPercent: 0,
        reserved: null,
        capacity: null,
        overbooked: 0,
        modifier: 0,
        style: 'success',
      }
    );
    expect(unloadingSpy).toHaveBeenCalledTimes(1);
  });

  it('sets the reservation data if reservation object exists', async () => {
    await service.fetchData(
      'Mock Park 1',
      'Mock Facility 1',
      '2022-12-29',
      'AM'
    );
    expect(loadingSpy).toHaveBeenCalledTimes(1);
    expect(loggerDebugSpy).toHaveBeenCalledTimes(1);
    expect(apiGetSpy).toHaveBeenCalledOnceWith('reservation', {
      park: 'Mock Park 1',
      facility: 'Mock Facility 1',
      date: '2022-12-29',
    });
    expect(setDataSpy).toHaveBeenCalledWith(
      Constants.dataIds.CURRENT_RESERVATIONS_OBJECT,
      mockReservationGetRes.value
    );
    expect(unloadingSpy).toHaveBeenCalledTimes(1);
  });

  it('sets the capacity bar if reservation object does not exist', async () => {
    await service.fetchData('noResObj', 'Mock Facility 1', '2022-12-29', 'AM');
    expect(loadingSpy).toHaveBeenCalledTimes(1);
    expect(loggerDebugSpy).toHaveBeenCalledTimes(1);
    expect(apiGetSpy).toHaveBeenCalledOnceWith('reservation', {
      park: 'noResObj',
      facility: 'Mock Facility 1',
      date: '2022-12-29',
    });
    expect(setDataSpy).toHaveBeenCalledWith(
      Constants.dataIds.CURRENT_RESERVATIONS_OBJECT,
      []
    );
    // gets current facility instead
    expect(getDataSpy).toHaveBeenCalledOnceWith(
      Constants.dataIds.CURRENT_FACILITY
    );
    expect(setDataSpy).toHaveBeenCalledWith(
      Constants.dataIds.CURRENT_CAPACITY_BAR_OBJECT,
      {
        capPercent: 0,
        reserved: 0,
        capacity: 5,
        overbooked: 0,
        modifier: 0,
        style: 'success',
      }
    );
    expect(unloadingSpy).toHaveBeenCalledTimes(1);
  });

  it('throws error when reservation get fails', async () => {
    // throw error
    loadingSpy.and.throwError('get error');
    await service.fetchData(
      'Mock Park 1',
      'Mock Facility 1',
      '2022-12-29',
      'AM'
    );
    expect(toastSpy).toHaveBeenCalledTimes(1);
    expect(eventSpy).toHaveBeenCalledOnceWith(
      new EventObject(
        EventKeywords.ERROR,
        'Error: get error',
        'Reservation Service'
      )
    );
  });
});
