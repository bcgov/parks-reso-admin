import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MetricsService } from './metrics.service';
import { ApiService } from './api.service';
import { DataService } from './data.service';
import { ToastService } from './toast.service';
import { EventService } from './event.service';
import { LoadingService } from './loading.service';
import { LoggerService } from './logger.service';
import { Constants } from '../shared/utils/constants';

describe('MetricsService', () => {
  let service: MetricsService;
  let mockApiService: jasmine.SpyObj<ApiService>;
  let mockDataService: jasmine.SpyObj<DataService>;
  let mockToastService: jasmine.SpyObj<ToastService>;
  let mockEventService: jasmine.SpyObj<EventService>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;
  let mockLoggerService: jasmine.SpyObj<LoggerService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['get']);
    const dataServiceSpy = jasmine.createSpyObj('DataService', ['getItemValue', 'setItemValue']);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['addMessage']);
    const eventServiceSpy = jasmine.createSpyObj('EventService', ['setError']);
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['addToFetchList', 'removeToFetchList']);
    const loggerServiceSpy = jasmine.createSpyObj('LoggerService', ['debug', 'error']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: { queryParams: {} }
    });

    TestBed.configureTestingModule({
      providers: [
        MetricsService,
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: DataService, useValue: dataServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: EventService, useValue: eventServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: LoggerService, useValue: loggerServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    });

    service = TestBed.inject(MetricsService);
    mockApiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    mockDataService = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
    mockToastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    mockEventService = TestBed.inject(EventService) as jasmine.SpyObj<EventService>;
    mockLoadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
    mockLoggerService = TestBed.inject(LoggerService) as jasmine.SpyObj<LoggerService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockActivatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('sets filter params', () => {
    const mockParams = { foo: 'bar' };
    service.setFilterParams(mockParams);
    expect(mockDataService.setItemValue).toHaveBeenCalledWith(Constants.dataIds.METRICS_FILTERS_PARAMS, mockParams);
  });

  it('handles fetchData with no facilities', async () => {
    mockDataService.getItemValue.and.returnValue({});
    await service.fetchData('2023-01-31');
    expect(mockApiService.get).not.toHaveBeenCalled();
  });

  it('validateMetricsParams returns false for missing dateRange', () => {
    const params = { park: 'all', facility: 'all' };
    expect(service.validateMetricsParams(params)).toBeFalse();
  });

  it('validateMetricsParams returns true for empty dateRange', () => {
    const params = { park: 'all', facility: 'all', dateRange: [] };
    expect(service.validateMetricsParams(params)).toBeTrue();
  });

  it('validateMetricsParams returns true for single item dateRange', () => {
    const params = { park: 'all', facility: 'all', dateRange: ['2023-01-01'] };
    expect(service.validateMetricsParams(params)).toBeTrue();
  });

  it('validateMetricsParams returns false for facility not all when requireAll is true', () => {
    const params = { park: 'all', facility: 'Mock Facility', dateRange: ['2023-01-01', '2023-01-02'] };
    expect(service.validateMetricsParams(params, true)).toBeFalse();
  });

  it('generateCapacityReportCSV does not call downloadCSV if params invalid', () => {
    const downloadSpy = spyOn(service['utils'], 'downloadCSV');
    service.generateCapacityReportCSV([], {});
    expect(downloadSpy).not.toHaveBeenCalled();
  });

});
