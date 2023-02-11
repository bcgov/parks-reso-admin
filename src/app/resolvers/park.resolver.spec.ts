import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from '../services/config.service';
import { DataService } from '../services/data.service';
import { Constants } from '../shared/utils/constants';
import { MockData } from '../shared/utils/mock-data';

import { ParkResolver } from './park.resolver';

describe('ParkResolver', () => {
  let resolver: ParkResolver;
  let route: ActivatedRoute;

  let mockActivatedRoute = {
    snapshot: {
      params: {
        parkId: 'MOC1',
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
    resolver = TestBed.inject(ParkResolver);
    route = TestBed.inject(ActivatedRoute);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('resolves park', async () => {
    const setItemSpy = spyOn(resolver['dataService'], 'setItemValue');
    await resolver.resolve(route.snapshot);
    expect(setItemSpy).toHaveBeenCalledTimes(2);
    expect(setItemSpy).toHaveBeenCalledWith(
      Constants.dataIds.CURRENT_PARK,
      mockParkFacility1.MOC1
    );
    expect(setItemSpy).toHaveBeenCalledWith(
      Constants.dataIds.FACILITIES_LIST,
      Object.values(mockParkFacility1.MOC1.facilities)
    );
  });
});
