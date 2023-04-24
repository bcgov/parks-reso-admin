import { TestBed } from '@angular/core/testing';
import { Constants } from '../shared/utils/constants';

import { FacilityAddResolver } from './facility-add.resolver';

describe('FacilityAddResolver', () => {
  let resolver: FacilityAddResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(FacilityAddResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('resolves facility add', async () => {
    const setItemSpy = spyOn(resolver['dataService'], 'setItemValue');
    await resolver.resolve();
    expect(setItemSpy).toHaveBeenCalledOnceWith(
      Constants.dataIds.CURRENT_FACILITY_KEY,
      null
    );
  });
});
