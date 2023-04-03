import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { Constants } from '../shared/utils/constants';
import { MockData } from '../shared/utils/mock-data';
import { ApiService } from './api.service';
import { ConfigService } from './config.service';
import { DataService } from './data.service';
import { LoggerService } from './logger.service';

import { MetricsService } from './metrics.service';

describe('MetricsService', () => {
  let service: MetricsService;

  let mockMetrics = MockData.mockMetrics1;
  let mockParkFacilities = MockData.mockParkFacility_1;

  let mockApiService = {
    get: (id, params) => {
      if (id === 'metrics') {
        return new BehaviorSubject([mockMetrics])
      }
      return new BehaviorSubject(null);
    },
  }

  let mockDataService = {
    setItemValue: (id, data) => {
      return new BehaviorSubject(null);
    },
    getItemValue: (id) => {
      if (id === Constants.dataIds.PARK_AND_FACILITY_LIST) {
        return mockParkFacilities;
      }
      return new BehaviorSubject(null);
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpClient,
        HttpHandler,
        ConfigService,
        LoggerService,
        { provide: ApiService, useValue: mockApiService },
        { provide: DataService, useValue: mockDataService },
      ],
      imports: [RouterTestingModule],
    });
    service = TestBed.inject(MetricsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('fetches all metrics from all parks', async () => {
    const apiSpy = spyOn(service['apiService'], 'get').and.callThrough();
    await service.fetchData('2023-01-31');
    // call api once for every facility in every park
    let facilityCount = 0;
    for (const park in mockParkFacilities) {
      facilityCount += Object.keys(mockParkFacilities[park].facilities).length;
    }
    expect(apiSpy).toHaveBeenCalledTimes(facilityCount);
  });

  it('fetches all metrics from all facilities in a park', async () => {
    const apiSpy = spyOn(service['apiService'], 'get').and.callThrough();
    const parkSk = Object.keys(mockParkFacilities)[0];
    await service.fetchData('2023-01-31', '2023-01-31', parkSk);
    // call api once for every facility in parkSk
    let facilityCount = Object.keys(mockParkFacilities[parkSk].facilities).length;
    expect(apiSpy).toHaveBeenCalledTimes(facilityCount);
  })

  it('fetches all metrics from one facility', async () => {
    const apiSpy = spyOn(service['apiService'], 'get').and.callThrough();
    const parkSk = Object.keys(mockParkFacilities)[0];
    const facilitySk = Object.keys(mockParkFacilities[parkSk].facilities)[0];
    // should call api just once
    await service.fetchData('2023-01-31', '2023-01-31', parkSk, facilitySk);
    expect(apiSpy).toHaveBeenCalledTimes(1);
  })

  it('sets filter params', async () => {
    const filterSpy = spyOn(service['dataService'], 'setItemValue');
    service.setFilterParams('params');
    expect(filterSpy).toHaveBeenCalledWith(
      Constants.dataIds.METRICS_FILTERS_PARAMS,
      'params'
    )
  })
});
