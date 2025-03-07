import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { QrScannerService } from 'src/app/shared/components/qr-scanner/qr-scanner.service';
import { Constants } from 'src/app/shared/utils/constants';

import { QrResultComponent } from './qr-result.component';

describe('QrResultComponent', () => {
  let component: QrResultComponent;
  let fixture: ComponentFixture<QrResultComponent>;

  let mockDataService = {
    watchItem: (id) => {
      return new BehaviorSubject(null);
    },
    setItemValue: (id, value) => {},
  };
  let mockQrScannerService = {
    enableScanner: (id) => {},
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [QrResultComponent],
    providers: [
        { provide: QrScannerService, useValue: mockQrScannerService },
        { provide: DataService, useValue: mockDataService },
    ],
}).compileComponents();

    fixture = TestBed.createComponent(QrResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return to scanner', () => {
    const getItemValueSpy = spyOn(mockDataService, 'setItemValue');
    const enableScannerSpy = spyOn(mockQrScannerService, 'enableScanner');
    component.returnToScanner();
    expect(getItemValueSpy).toHaveBeenCalledOnceWith(
      Constants.dataIds.PASS_CHECK_IN_LIST,
      []
    );
    expect(enableScannerSpy).toHaveBeenCalled();
  });
});
