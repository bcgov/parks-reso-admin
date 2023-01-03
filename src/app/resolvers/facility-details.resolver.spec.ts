import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { ConfigService } from '../services/config.service';
import { Constants } from '../shared/utils/constants';
import { MockData } from '../shared/utils/mock-data';

import { FacilityDetailsResolver } from './facility-details.resolver';

describe('FacilityDetailsResolver', () => {
  let resolver: FacilityDetailsResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler, ConfigService],
    });
    resolver = TestBed.inject(FacilityDetailsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('resolves facility details', async () => {
    const dataGetSpy = spyOn(
      resolver['dataService'],
      'getItemValue'
    ).and.returnValue([MockData.mockFacility_1]);
    const setParamsSpy = spyOn(
      resolver['passService'],
      'setParamsFromUrl'
    ).and.callThrough();
    const reservationFetchSpy = spyOn(
      resolver['reservationService'],
      'fetchData'
    );
    await resolver.resolve(new ActivatedRouteSnapshot());
    expect(dataGetSpy).toHaveBeenCalledOnceWith(
      Constants.dataIds.CURRENT_FACILITY
    );
    expect(setParamsSpy).toHaveBeenCalledOnceWith(
      MockData.mockFacility_1,
      undefined
    );
    expect(reservationFetchSpy).toHaveBeenCalledTimes(1);
  });
});
