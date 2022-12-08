import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ConfigService } from './config.service';
import { DataService } from './data.service';
import { EventService } from './event.service';
import { LoadingService } from './loading.service';

import { PassService } from './pass.service';
import { ToastService } from './toast.service';
import { LoggerService } from './logger.service';

describe('PassService', () => {
  let service: PassService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpClient,
        DataService,
        EventService,
        ToastService,
        HttpHandler,
        LoggerService,
        ConfigService,
        LoadingService,
      ],
    });
    service = TestBed.inject(PassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
