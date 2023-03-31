import { HttpClient, HttpHandler } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { ConfigService } from "../services/config.service";
import { DataService } from "../services/data.service";
import { MockData } from "../shared/utils/mock-data";
import { MetricsResolver } from "./metrics.resolver";

describe('ParkResolver', () => {
  let resolver: MetricsResolver;
  let route: ActivatedRoute;

  let mockActivatedRoute = {
    snapshot: {
      params: {
        parkId: 'MOC1',
      },
    },
  };
  let mockDateRange = ['2023-01-30', '2023-02-01'];
  let mockMetricsParams = {
    timeSpan: null,
    park: MockData.mockPark_1.sk,
    facility: MockData.mockFacility_1.sk,
    dateRange: mockDateRange
  }

  let mockParkFacility1 = MockData.mockParkFacility_1;

  let mockDataService = {
    getItemValue: () => {
      return new BehaviorSubject(mockMetricsParams);
    },
    setItemValue: () => {
      return new BehaviorSubject(null);
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpClient,
        HttpHandler,
        ConfigService,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: DataService, useValue: mockDataService },
      ],
    });
    resolver = TestBed.inject(MetricsResolver);
    route = TestBed.inject(ActivatedRoute);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should not preset params if they exist', async () => {
    resolver.resolve();
    const filterSpy = spyOn(resolver['metricsService'], 'setFilterParams');
    expect(filterSpy).not.toHaveBeenCalled();
  })

  it('should preset params if they do not exist', async () => {
    const filterSpy = spyOn(resolver['metricsService'], 'setFilterParams');
    mockMetricsParams = null;
    resolver.resolve();
    expect(filterSpy).toHaveBeenCalled();
  })
});