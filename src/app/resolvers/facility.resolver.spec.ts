import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { ConfigService } from '../services/config.service';

import { FacilityResolver } from './facility.resolver';

describe('FacilityResolver', () => {
  let resolver: FacilityResolver;
  let route: ActivatedRoute;

  let mockActivatedRoute = {
    snapshot: {
      params: {
        parkId: 'Mock Park 1',
        facilityId: 'Mock Facility 1',
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpClient,
        HttpHandler,
        ConfigService,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });
    resolver = TestBed.inject(FacilityResolver);
    route = TestBed.inject(ActivatedRoute);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('resolves facility', async () => {
    const facilityFetchSpy = spyOn(resolver['facilityService'], 'fetchData');
    await resolver.resolve(route.snapshot);
    expect(facilityFetchSpy).toHaveBeenCalledOnceWith(
      'Mock Park 1',
      'Mock Facility 1'
    );
  });
});
