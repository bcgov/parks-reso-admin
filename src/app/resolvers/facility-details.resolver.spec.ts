import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ConfigService } from '../services/config.service';

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
});
