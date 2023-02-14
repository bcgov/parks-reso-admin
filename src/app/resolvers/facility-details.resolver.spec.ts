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

describe('FacilityDetailsResolver', () => {
  let resolver: FacilityDetailsResolver;
  let route: ActivatedRoute;

  let mockActivatedRoute = {
    snapshot: {
      queryParams: {},
    },
  };

  let mockFacility1 = MockData.mockFacility_1;

  let mockDataService = {
    watchItem: (id) => {
      if (id === Constants.dataIds.CURRENT_FACILITY) {
        return new BehaviorSubject(mockFacility1);
      }
      return new BehaviorSubject(null);
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
