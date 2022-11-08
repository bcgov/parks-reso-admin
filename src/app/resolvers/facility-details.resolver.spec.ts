import { TestBed } from '@angular/core/testing';

import { FacilityDetailsResolver } from './facility-details.resolver';

describe('FacilityDetailsResolver', () => {
  let resolver: FacilityDetailsResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(FacilityDetailsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
