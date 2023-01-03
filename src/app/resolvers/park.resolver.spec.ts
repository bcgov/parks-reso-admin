import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '../services/config.service';

import { ParkResolver } from './park.resolver';

describe('ParkResolver', () => {
  let resolver: ParkResolver;
  let route: ActivatedRoute;

  let mockActivatedRoute = {
    snapshot: {
      params: {
        parkId: 'Mock Park 1',
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
    resolver = TestBed.inject(ParkResolver);
    route = TestBed.inject(ActivatedRoute);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('resolves park', async () => {
    const parkFetchSpy = spyOn(resolver['parkService'], 'fetchData');
    await resolver.resolve(route.snapshot);
    expect(parkFetchSpy).toHaveBeenCalledOnceWith('Mock Park 1');
  });
});
