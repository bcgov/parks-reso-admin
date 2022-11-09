import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ConfigService } from '../services/config.service';

import { FacilityResolver } from './facility.resolver';

describe('FacilityResolver', () => {
  let resolver: FacilityResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler, ConfigService],
    });
    resolver = TestBed.inject(FacilityResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
