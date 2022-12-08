import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ConfigService } from './config.service';
import { DataService } from './data.service';
import { EventService } from './event.service';

import { FacilityService } from './facility.service';
import { LoadingService } from './loading.service';
import { ToastService } from './toast.service';
import { LoggerService } from './logger.service';

describe('FacilityService', () => {
  let service: FacilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpClient,
        DataService,
        EventService,
        ToastService,
        LoggerService,
        HttpHandler,
        ConfigService,
        LoadingService,
      ]
    });
    service = TestBed.inject(FacilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
