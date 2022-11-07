import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ConfigService } from './config.service';

import { ModifierService } from './modifier.service';

describe('ModifierService', () => {
  let service: ModifierService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler, ConfigService],
    });
    service = TestBed.inject(ModifierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
