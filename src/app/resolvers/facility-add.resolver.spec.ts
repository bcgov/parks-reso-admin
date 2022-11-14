import { TestBed } from '@angular/core/testing';

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
});
