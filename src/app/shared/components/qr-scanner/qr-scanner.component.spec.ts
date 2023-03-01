import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';

import { QrScannerComponent } from './qr-scanner.component';
import { QrScannerService } from './qr-scanner.service';

describe('QrScannerComponent', () => {
  let component: QrScannerComponent;
  let fixture: ComponentFixture<QrScannerComponent>;

  let mockMediaDeviceInfo1 = {
    deviceId: 'device1',
    groupId: 'group1',
    kind: 'videoinput',
    label: 'camera1',
  } as MediaDeviceInfo;
  let mockMediaDeviceInfo2 = {
    deviceId: 'device2',
    groupId: 'group2',
    kind: 'videoinput',
    label: 'camera2',
  } as MediaDeviceInfo;

  let mockMediaDeviceInfoArray = [mockMediaDeviceInfo1, mockMediaDeviceInfo2];

  let mockQrScannerService = {
    enableScanner: () => {},
    watchScannerState: () => {
      return new BehaviorSubject(true);
    },
    setScannerOutput: (resultString) => {},
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QrScannerComponent],
      providers: [
        ConfigService,
        { provide: QrScannerService, useValue: mockQrScannerService },
      ],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(QrScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
    expect(component.scannerEnabled).toBeDefined();
    expect(component.scannerEnabled).toEqual(true);
    expect(component.scanningState).toBeDefined();
    expect(component.scanningState).toEqual('scanning');
    expect(component.showScanIndicator).toBeDefined();
    expect(component.showScanIndicator).toEqual(true);
    expect(component.tryHarder).toBeDefined();
    expect(component.tryHarder).toEqual(true);
  });

  it('should clear QR result', async () => {
    component.qrResultString = 'test-result-string';
    component.scanningState = 'disabled';

    component.clearResult();

    expect(component.qrResultString).toEqual(null);
    expect(component.scanningState).toEqual('scanning');
  });

  it('should set available devices on camera found', async () => {
    component.availableDevices = [];
    component.hasDevices = false;

    component.onCamerasFound(mockMediaDeviceInfoArray);

    expect(component.availableDevices).toEqual(mockMediaDeviceInfoArray);
    expect(component.hasDevices).toEqual(true);
  });

  it('should set result string on code result', async () => {
    let mockResult = 'fake-result-string';
    component.scanningState = 'scanning';
    component.qrResultString = '';

    component.onCodeResult(mockResult);

    expect(component.scanningState).toEqual('found');
    expect(component.qrResultString).toEqual(mockResult);
  });

  it('should set device on device select change', async () => {
    component.availableDevices = mockMediaDeviceInfoArray;
    component.deviceCurrent = undefined;
    component.showScanIndicator = false;

    component.onDeviceSelectChange(mockMediaDeviceInfo1.deviceId);

    expect(component.deviceCurrent).toEqual(mockMediaDeviceInfo1);
    expect(component.showScanIndicator).toEqual(true);
  });

  it('should set device on device change', async () => {
    component.deviceSelected = mockMediaDeviceInfo1.deviceId;
    component.deviceCurrent = mockMediaDeviceInfo1;
    component.scanningState = 'disabled';

    component.onDeviceChange(mockMediaDeviceInfo2);

    expect(component.deviceSelected).toEqual(mockMediaDeviceInfo2.deviceId);
    expect(component.deviceCurrent).toEqual(mockMediaDeviceInfo2);
    expect(component.scanningState).toEqual('scanning');
  });

  it('should set has permission on has permission', async () => {
    component.hasPermission = false;

    component.onHasPermission(true);

    expect(component.hasPermission).toEqual(true);
  });
});
