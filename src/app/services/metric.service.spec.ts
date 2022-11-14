import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfigService } from './config.service';

import { MetricService } from './metric.service';

describe('MetricService', () => {
  let service: MetricService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler, ConfigService],
      imports: [RouterTestingModule],
    });
    service = TestBed.inject(MetricService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
