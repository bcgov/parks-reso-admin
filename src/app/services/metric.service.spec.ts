import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ConfigService } from './config.service';
import { LoggerService } from './logger.service';
import { ApiService } from './api.service';
import { EventService, EventKeywords, EventObject } from './event.service';
import { ToastService } from './toast.service';
import { Constants } from '../shared/utils/constants';

import { MetricService } from './metric.service';

describe('MetricService', () => {
  let service: MetricService;
  let mockApiService: jasmine.SpyObj<ApiService>;
  let mockEventService: jasmine.SpyObj<EventService>;
  let mockLoggerService: jasmine.SpyObj<LoggerService>;
  let mockToastService: jasmine.SpyObj<ToastService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  beforeEach(() => {
    // Create a special spy for ApiService that can return promises
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['get']);
    // Override the get method to return promises instead of observables
    apiServiceSpy.get.and.callFake((endpoint: string, params: any) => {
      // This will be overridden in individual tests
      return Promise.resolve({});
    });
    
    const eventServiceSpy = jasmine.createSpyObj('EventService', ['setError']);
    const loggerServiceSpy = jasmine.createSpyObj('LoggerService', ['debug', 'error']);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['addMessage']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    // ActivatedRoute doesn't need spy methods, just properties
    const activatedRouteStub = {
      snapshot: { queryParams: {} },
      params: of({}),
      queryParams: of({})
    };

    TestBed.configureTestingModule({
      providers: [
        MetricService,
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: EventService, useValue: eventServiceSpy },
        { provide: LoggerService, useValue: loggerServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        HttpClient,
        HttpHandler,
        ConfigService
      ]
    });

    service = TestBed.inject(MetricService);
    mockApiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    mockEventService = TestBed.inject(EventService) as jasmine.SpyObj<EventService>;
    mockLoggerService = TestBed.inject(LoggerService) as jasmine.SpyObj<LoggerService>;
    mockToastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockActivatedRoute = TestBed.inject(ActivatedRoute);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchData', () => {
    it('should successfully fetch metric data', async () => {
      const mockMetric = 'capacity';
      const mockResponse = { data: 'test metric data' };
      
      // Use callFake with any cast to bypass TypeScript Observable type checking
      (mockApiService.get as any).and.callFake(() => Promise.resolve(mockResponse));
      
      const result = await service.fetchData(mockMetric);
      
      expect(mockLoggerService.debug).toHaveBeenCalledWith(`Metric GET: ${mockMetric}`);
      expect(mockApiService.get).toHaveBeenCalledWith('metric', { type: mockMetric });
      expect(result).toEqual(mockResponse);
    });

    it('should log debug message with correct metric type', async () => {
      const mockMetric = 'utilization';
      (mockApiService.get as any).and.callFake(() => Promise.resolve({}));
      
      await service.fetchData(mockMetric);
      
      expect(mockLoggerService.debug).toHaveBeenCalledWith('Metric GET: utilization');
    });

    it('should handle API errors and show error toast', async () => {
      const mockMetric = 'capacity';
      const mockError = new Error('API Error');
      
      (mockApiService.get as any).and.callFake(() => Promise.reject(mockError));
      
      await service.fetchData(mockMetric);
      
      expect(mockLoggerService.error).toHaveBeenCalledWith(JSON.stringify(mockError));
      expect(mockToastService.addMessage).toHaveBeenCalledWith(
        'An error has occured while getting .',
        'Pass Service',
        Constants.ToastTypes.ERROR
      );
    });

    it('should set error event when API call fails', async () => {
      const mockMetric = 'utilization';
      const mockError = 'Network Error';
      
      (mockApiService.get as any).and.callFake(() => Promise.reject(mockError));
      
      await service.fetchData(mockMetric);
      
      expect(mockEventService.setError).toHaveBeenCalledWith(
        new EventObject(EventKeywords.ERROR, mockError, 'Metric Service')
      );
    });

    it('should navigate away when error occurs', async () => {
      const mockMetric = 'capacity';
      const mockError = 'Database Error';
      
      (mockApiService.get as any).and.callFake(() => Promise.reject(mockError));
      
      await service.fetchData(mockMetric);
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['../', { relativeTo: mockActivatedRoute }]);
    });

    it('should handle string errors correctly', async () => {
      const mockMetric = 'test';
      const stringError = 'Simple string error';
      
      (mockApiService.get as any).and.callFake(() => Promise.reject(stringError));
      
      await service.fetchData(mockMetric);
      
      expect(mockLoggerService.error).toHaveBeenCalledWith(JSON.stringify(stringError));
      expect(mockEventService.setError).toHaveBeenCalledWith(
        new EventObject(EventKeywords.ERROR, stringError, 'Metric Service')
      );
    });

    it('should handle complex object errors', async () => {
      const mockMetric = 'test';
      const complexError = { 
        status: 500, 
        message: 'Internal Server Error',
        details: { code: 'DB_CONNECTION_FAILED' }
      };
      
      (mockApiService.get as any).and.callFake(() => Promise.reject(complexError));
      
      await service.fetchData(mockMetric);
      
      expect(mockLoggerService.error).toHaveBeenCalledWith(JSON.stringify(complexError));
      expect(mockEventService.setError).toHaveBeenCalledWith(
        new EventObject(EventKeywords.ERROR, complexError as any, 'Metric Service')
      );
    });

    it('should call API with correct parameters for different metric types', async () => {
      const testCases = ['capacity', 'utilization', 'revenue', 'custom-metric'];
      
      for (const metricType of testCases) {
        (mockApiService.get as any).and.callFake(() => Promise.resolve({}));
        
        await service.fetchData(metricType);
        
        expect(mockApiService.get).toHaveBeenCalledWith('metric', { type: metricType });
      }
      
      expect(mockApiService.get).toHaveBeenCalledTimes(testCases.length);
    });

    it('should handle undefined/null metric parameter', async () => {
      (mockApiService.get as any).and.callFake(() => Promise.resolve({}));
      
      await service.fetchData(null);
      
      expect(mockLoggerService.debug).toHaveBeenCalledWith('Metric GET: null');
      expect(mockApiService.get).toHaveBeenCalledWith('metric', { type: null });
    });

    it('should handle empty string metric parameter', async () => {
      (mockApiService.get as any).and.callFake(() => Promise.resolve({}));
      
      await service.fetchData('');
      
      expect(mockLoggerService.debug).toHaveBeenCalledWith('Metric GET: ');
      expect(mockApiService.get).toHaveBeenCalledWith('metric', { type: '' });
    });
  });
});
