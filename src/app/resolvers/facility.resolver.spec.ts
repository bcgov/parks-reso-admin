import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from '../services/config.service';
import { DataService } from '../services/data.service';
import { Constants } from '../shared/utils/constants';
import { MockData } from '../shared/utils/mock-data';

import { FacilityResolver } from './facility.resolver';

describe('FacilityResolver', () => {
  let resolver: FacilityResolver;
  let route: ActivatedRoute;

  let mockActivatedRoute = {
    snapshot: {
      params: {
        parkId: 'MOC1',
        facilityId: 'Mock Facility 1',
      },
    },
  };

  let mockParkFacility1 = MockData.mockParkFacility_1;

  let mockDataService = {
    watchItem: (id) => {
      if (id === Constants.dataIds.PARK_AND_FACILITY_LIST) {
        return new BehaviorSubject(mockParkFacility1);
      }
      return new BehaviorSubject(null);
    },
    setItemValue: (id, obj) => {
      return null;
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
      ],
    });
    resolver = TestBed.inject(FacilityResolver);
    route = TestBed.inject(ActivatedRoute);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('resolves facility', async () => {
    const setItemSpy = spyOn(resolver['dataService'], 'setItemValue');
    await resolver.resolve(route.snapshot);
    expect(setItemSpy).toHaveBeenCalledOnceWith(
      Constants.dataIds.CURRENT_FACILITY,
      mockParkFacility1.MOC1.facilities['Mock Facility 1']
    );
  });
});
