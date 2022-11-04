import { TestBed } from '@angular/core/testing';

import { ModifierService } from './modifier.service';

describe('ModifierService', () => {
  let service: ModifierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModifierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
