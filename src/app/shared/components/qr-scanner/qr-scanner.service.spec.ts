import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { QrScannerService } from './qr-scanner.service';

describe('QrScannerService', () => {
  let service: QrScannerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QrScannerService);
  });

  it('should be created', async () => {
    expect(service).toBeTruthy();
    expect(service.getScannerState()).toEqual(false);
    expect(service.getScannerOutput()).toEqual(null);
  });

  it('should return behavour subject on watch scanner state', async () => {
    expect(service.watchScannerState()).toEqual(new BehaviorSubject(false));
  });

  it('should return false on get scanner state', async () => {
    expect(service.getScannerState()).toEqual(false);
  });

  it('should set scanner switch to true on enable scanner', async () => {
    service.enableScanner();
    expect(service.getScannerState()).toEqual(true);
  });

  it('should set scanner switch to false on disable scanner', async () => {
    service.enableScanner();
    expect(service.getScannerState()).toEqual(true);

    service.disableScanner();
    expect(service.getScannerState()).toEqual(false);
  });

  it('should set scanner output on set scanner output', async () => {
    const testString = 'test';
    service.setScannerOutput(testString);
    expect(service.getScannerOutput()).toEqual(testString);
  });

  it('should clear scanner output on clear scanner output', async () => {
    const testString = 'test';
    service.setScannerOutput(testString);
    expect(service.getScannerOutput()).toEqual(testString);
    service.clearScannerOutput();
    expect(service.getScannerOutput()).toEqual(null);
  });

  it('should return behavour subject on watch scanner output', async () => {
    expect(service.watchScannerOutput()).toEqual(new BehaviorSubject(null));
  });
});
