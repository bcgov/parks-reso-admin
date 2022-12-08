import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ConfigService } from './config.service';

import { ModifierService } from './modifier.service';
import { LoggerService } from './logger.service';

describe('ModifierService', () => {
  let service: ModifierService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler, ConfigService, LoggerService],
    });
    service = TestBed.inject(ModifierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
