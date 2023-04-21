import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from '../services/config.service';
import { DataService } from '../services/data.service';
import { PassService } from '../services/pass.service';
import { Constants } from '../shared/utils/constants';
import { MockData } from '../shared/utils/mock-data';

import { FacilityDetailsResolver } from './facility-details.resolver';
import { FacilityService } from '../services/facility.service';

describe('FacilityDetailsResolver', () => {
  let resolver: FacilityDetailsResolver;
  let route: ActivatedRoute;

  let mockActivatedRoute = {
    snapshot: {
      queryParams: {},
    },
  };

  let mockFacility1 = MockData.mockFacility_1;
  let mockFacility1Key = {pk: mockFacility1.pk, sk: mockFacility1.sk};

  let mockDataService = {
    watchItem: (id) => {
      if (id === Constants.dataIds.CURRENT_FACILITY_KEY) {
        return new BehaviorSubject(mockFacility1Key);
      }
      return new BehaviorSubject(null);
    },
  };

  let mockFacilityService = {
    getCachedFacility: (facilityKey) => {
      if (facilityKey === mockFacility1Key) {
        return mockFacility1;
      }
      return null;
    },
  };

  let mockPassService = {
    setParamsFromUrl: (facility, queryParams) => {
      return {
        park: facility.pk.split('::')[1],
        facilityName: facility.name,
        date: null,
        passType: null,
      };
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpClient,
        HttpHandler,
        ConfigService,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: DataService, useValue: mockDataService },
        { provide: PassService, useValue: mockPassService },
        { provide: FacilityService, useValue: mockFacilityService },
      ],
    });
    resolver = TestBed.inject(FacilityDetailsResolver);
    route = TestBed.inject(ActivatedRoute);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('resolves facility', async () => {
    const setParamsFromUrlSpy = spyOn(mockPassService, 'setParamsFromUrl');
    await resolver.resolve(route.snapshot);
    expect(setParamsFromUrlSpy).toHaveBeenCalledOnceWith(mockFacility1, {});
  });
});
