import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError, forkJoin } from 'rxjs';
import { AutoFetchService } from './auto-fetch.service';
import { ConfigService } from './config.service';
import { LoggerService } from './logger.service';
import { ApiService } from './api.service';
import { DataService } from './data.service';
import { ParkService } from './park.service';
import { FacilityService } from './facility.service';
import { Constants } from '../shared/utils/constants';

describe('AutoFetchService', () => {
  let service: AutoFetchService;
  let mockLoggerService: jasmine.SpyObj<LoggerService>;
  let mockApiService: jasmine.SpyObj<ApiService>;
  let mockDataService: jasmine.SpyObj<DataService>;
  let mockParkService: jasmine.SpyObj<ParkService>;
  let mockFacilityService: jasmine.SpyObj<FacilityService>;

  beforeEach(async () => {
    const loggerServiceSpy = jasmine.createSpyObj('LoggerService', ['debug', 'error']);
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [], {
      isNetworkOffline: false
    });
    const dataServiceSpy = jasmine.createSpyObj('DataService', ['getItemValue', 'setItemValue']);
    const parkServiceSpy = jasmine.createSpyObj('ParkService', ['fetchData']);
    const facilityServiceSpy = jasmine.createSpyObj('FacilityService', ['fetchData']);

    TestBed.configureTestingModule({
      providers: [
        AutoFetchService,
        HttpClient,
        HttpHandler,
        ConfigService,
        { provide: LoggerService, useValue: loggerServiceSpy },
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: DataService, useValue: dataServiceSpy },
        { provide: ParkService, useValue: parkServiceSpy },
        { provide: FacilityService, useValue: facilityServiceSpy }
      ],
    });

    service = TestBed.inject(AutoFetchService);
    mockLoggerService = TestBed.inject(LoggerService) as jasmine.SpyObj<LoggerService>;
    mockApiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    mockDataService = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
    mockParkService = TestBed.inject(ParkService) as jasmine.SpyObj<ParkService>;
    mockFacilityService = TestBed.inject(FacilityService) as jasmine.SpyObj<FacilityService>;

    service.timeIntevalSeconds = 1;
    // https://github.com/gruntjs/grunt-contrib-jasmine/issues/213
    // Receiving error unless uninstall/install are both in beforeEach
    // likely due to async nature of tests
    jasmine.clock().uninstall();
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.fetchQueue).toBeDefined();
    expect(service.fetchQueue).toEqual([Constants.dataIds.PARK_AND_FACILITY_LIST]);
  });

  it('should have default time interval of 5 minutes', () => {
    const newService = new AutoFetchService(
      mockParkService,
      mockFacilityService,
      mockDataService,
      mockLoggerService,
      mockApiService
    );
    expect(newService.timeIntevalSeconds).toBe(5 * 60);
  });

  describe('run', () => {
    it('should call runFetches immediately and set up interval', async () => {
      const runFetchesSpy = spyOn(service, 'runFetches').and.callThrough();
      
      await service.run();
      
      expect(runFetchesSpy).toHaveBeenCalledWith(service.fetchQueue);
      expect(runFetchesSpy).toHaveBeenCalledTimes(1);
      
      // Advance time to trigger interval
      jasmine.clock().tick(1001);
      expect(runFetchesSpy).toHaveBeenCalledTimes(2);
      expect(mockLoggerService.debug).toHaveBeenCalledWith(
        `RunFetches ${JSON.stringify(service.fetchQueue)}`
      );
    });

    it('should continue running fetches at specified intervals', async () => {
      const runFetchesSpy = spyOn(service, 'runFetches').and.callThrough();
      
      await service.run();
      
      // First call
      expect(runFetchesSpy).toHaveBeenCalledTimes(1);
      
      // Second call after interval
      jasmine.clock().tick(1001);
      expect(runFetchesSpy).toHaveBeenCalledTimes(2);
      
      // Third call after another interval
      jasmine.clock().tick(1001);
      expect(runFetchesSpy).toHaveBeenCalledTimes(3);
    });
  });

  describe('runFetches', () => {
    it('should skip fetching when network is offline', () => {
      Object.defineProperty(mockApiService, 'isNetworkOffline', {
        get: () => true
      });
      
      const fetchParkAndFacilitySpy = spyOn(service, 'fetchParkAndFacility');
      
      service.runFetches([Constants.dataIds.PARK_AND_FACILITY_LIST]);
      
      expect(fetchParkAndFacilitySpy).not.toHaveBeenCalled();
    });

    it('should call fetchParkAndFacility when online and queue contains PARK_AND_FACILITY_LIST', () => {
      Object.defineProperty(mockApiService, 'isNetworkOffline', {
        get: () => false
      });
      
      const fetchParkAndFacilitySpy = spyOn(service, 'fetchParkAndFacility');
      
      service.runFetches([Constants.dataIds.PARK_AND_FACILITY_LIST]);
      
      expect(fetchParkAndFacilitySpy).toHaveBeenCalled();
    });

    it('should handle multiple items in fetch queue', () => {
      Object.defineProperty(mockApiService, 'isNetworkOffline', {
        get: () => false
      });
      
      const fetchParkAndFacilitySpy = spyOn(service, 'fetchParkAndFacility');
      
      service.runFetches([
        Constants.dataIds.PARK_AND_FACILITY_LIST,
        Constants.dataIds.PARK_AND_FACILITY_LIST,
        'unknown-id'
      ]);
      
      expect(fetchParkAndFacilitySpy).toHaveBeenCalledTimes(2);
    });

    it('should handle empty fetch queue', () => {
      Object.defineProperty(mockApiService, 'isNetworkOffline', {
        get: () => false
      });
      
      const fetchParkAndFacilitySpy = spyOn(service, 'fetchParkAndFacility');
      
      service.runFetches([]);
      
      expect(fetchParkAndFacilitySpy).not.toHaveBeenCalled();
    });
  });

  describe('fetchParkAndFacility', () => {
    it('should fetch parks and facilities and set data', (done) => {
      const mockParks = [
        { sk: 'park1', name: 'Park 1' },
        { sk: 'park2', name: 'Park 2' }
      ];
      const mockFacilities1 = [
        { sk: 'facility1', name: 'Facility 1' },
        { sk: 'facility2', name: 'Facility 2' }
      ];
      const mockFacilities2 = [
        { sk: 'facility3', name: 'Facility 3' }
      ];

      mockParkService.fetchData.and.returnValue(Promise.resolve(mockParks));
      mockFacilityService.fetchData.and.callFake((parkSk) => {
        if (parkSk === 'park1') {
          return Promise.resolve(mockFacilities1);
        } else {
          return Promise.resolve(mockFacilities2);
        }
      });
      mockDataService.getItemValue.and.returnValue(null);
      
      // Set up spy to detect when setItemValue is called
      mockDataService.setItemValue.and.callFake(() => {
        expect(mockParkService.fetchData).toHaveBeenCalledWith(null, true);
        expect(mockFacilityService.fetchData).toHaveBeenCalledWith('park1', null, true);
        expect(mockFacilityService.fetchData).toHaveBeenCalledWith('park2', null, true);
        done();
      });

      service.fetchParkAndFacility();
    });

    it('should handle empty parks array', () => {
      mockParkService.fetchData.and.returnValue(Promise.resolve([]));
      mockDataService.getItemValue.and.returnValue(null);

      service.fetchParkAndFacility();

      expect(mockParkService.fetchData).toHaveBeenCalledWith(null, true);
      expect(mockFacilityService.fetchData).not.toHaveBeenCalled();
      expect(mockDataService.setItemValue).not.toHaveBeenCalled();
    });

    it('should handle null parks response', () => {
      mockParkService.fetchData.and.returnValue(Promise.resolve(null));
      mockDataService.getItemValue.and.returnValue(null);

      service.fetchParkAndFacility();

      expect(mockParkService.fetchData).toHaveBeenCalledWith(null, true);
      expect(mockFacilityService.fetchData).not.toHaveBeenCalled();
      expect(mockDataService.setItemValue).not.toHaveBeenCalled();
    });

    it('should start fetching process when parks exist', async () => {
      const mockParks = [{ sk: 'park1', name: 'Park 1' }];
      const mockFacilities = [{ sk: 'facility1', name: 'Facility 1' }];

      mockParkService.fetchData.and.returnValue(Promise.resolve(mockParks));
      mockFacilityService.fetchData.and.returnValue(Promise.resolve(mockFacilities));
      mockDataService.getItemValue.and.returnValue(null);

      await service.fetchParkAndFacility();
      
      expect(mockParkService.fetchData).toHaveBeenCalledWith(null, true);
      expect(mockFacilityService.fetchData).toHaveBeenCalledWith('park1', null, true);
    });
  });

  describe('ignoreOrderCompare', () => {
    it('should return true for identical arrays', () => {
      const a = [{ key: 'value1' }, { key: 'value2' }];
      const b = [{ key: 'value1' }, { key: 'value2' }];
      
      const result = service.ignoreOrderCompare(a, b);
      
      expect(result).toBe(true);
    });

    it('should return true for arrays with same elements in different order', () => {
      const a = [{ key: 'value1' }, { key: 'value2' }];
      const b = [{ key: 'value2' }, { key: 'value1' }];
      
      const result = service.ignoreOrderCompare(a, b);
      
      expect(result).toBe(true);
    });

    it('should return false for arrays with different lengths', () => {
      const a = [{ key: 'value1' }];
      const b = [{ key: 'value1' }, { key: 'value2' }];
      
      const result = service.ignoreOrderCompare(a, b);
      
      expect(result).toBe(false);
      expect(mockLoggerService.debug).toHaveBeenCalledWith("Arrays have different sizes.");
    });

    it('should return false for arrays with different elements', () => {
      const a = [{ key: 'value1' }];
      const b = [{ key: 'value2' }];
      
      const result = service.ignoreOrderCompare(a, b);
      
      expect(result).toBe(false);
      expect(mockLoggerService.debug).toHaveBeenCalledWith(
        `Object not found or has a different count: ${JSON.stringify({ key: 'value2' })}`
      );
    });

    it('should return false when first parameter is not an array', () => {
      const a = 'not an array';
      const b = [{ key: 'value1' }];
      
      const result = service.ignoreOrderCompare(a, b);
      
      expect(result).toBe(false);
      expect(mockLoggerService.debug).toHaveBeenCalledWith("Both inputs must be arrays.");
    });

    it('should return false when second parameter is not an array', () => {
      const a = [{ key: 'value1' }];
      const b = 'not an array';
      
      const result = service.ignoreOrderCompare(a, b);
      
      expect(result).toBe(false);
      expect(mockLoggerService.debug).toHaveBeenCalledWith("Both inputs must be arrays.");
    });

    it('should handle duplicate objects correctly', () => {
      const a = [{ key: 'value1' }, { key: 'value1' }, { key: 'value2' }];
      const b = [{ key: 'value2' }, { key: 'value1' }, { key: 'value1' }];
      
      const result = service.ignoreOrderCompare(a, b);
      
      expect(result).toBe(true);
    });

    it('should return false when duplicate counts differ', () => {
      const a = [{ key: 'value1' }, { key: 'value1' }];
      const b = [{ key: 'value1' }, { key: 'value2' }];
      
      const result = service.ignoreOrderCompare(a, b);
      
      expect(result).toBe(false);
    });

    it('should handle empty arrays', () => {
      const a = [];
      const b = [];
      
      const result = service.ignoreOrderCompare(a, b);
      
      expect(result).toBe(true);
    });

    it('should handle complex nested objects', () => {
      const a = [{ 
        park: { sk: 'park1', facilities: { fac1: { name: 'Facility 1' } } }
      }];
      const b = [{ 
        park: { sk: 'park1', facilities: { fac1: { name: 'Facility 1' } } }
      }];
      
      const result = service.ignoreOrderCompare(a, b);
      
      expect(result).toBe(true);
    });
  });

  // Integration test
  it('fetches the queue (original test)', async () => {
    const fetchSpy = spyOn(service, 'runFetches').and.callThrough();
    mockParkService.fetchData.and.returnValue(Promise.resolve([]));
    
    await service.run();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    
    jasmine.clock().tick(1001);
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });
});
