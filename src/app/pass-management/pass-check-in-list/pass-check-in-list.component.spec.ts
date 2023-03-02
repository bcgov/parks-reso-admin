import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from 'src/app/services/config.service';
import { DataService } from 'src/app/services/data.service';
import { LoggerService } from 'src/app/services/logger.service';
import { PassService } from 'src/app/services/pass.service';
import { QrScannerService } from 'src/app/shared/components/qr-scanner/qr-scanner.service';
import { Constants } from 'src/app/shared/utils/constants';
import { MockData } from 'src/app/shared/utils/mock-data';

import { PassCheckInListComponent } from './pass-check-in-list.component';

describe('PassLookupComponent', () => {
  let component: PassCheckInListComponent;
  let fixture: ComponentFixture<PassCheckInListComponent>;

  let mockPassCheckedIn = { ...MockData.mockPass_1 };
  mockPassCheckedIn['checkedIn'] = true;
  mockPassCheckedIn['checkedInTime'] = '2023-03-01';

  let mockPassCheckedOut = { ...MockData.mockPass_1 };
  mockPassCheckedOut['checkedIn'] = false;

  const mockChange = {
    passes: {
      currentValue: [{ ...MockData.mockPass_1 }, { ...MockData.mockPass_2 }],
    },
  };
  const mockInvalidChange = {
    passes: {
      currentValue: null,
    },
  };

  let mockPassService = {
    checkInPass: (orcId, passRegNumber) => {
      return mockPassCheckedIn;
    },
    checkOutPass: (orcId, passRegNumber) => {
      return mockPassCheckedOut;
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PassCheckInListComponent],
      providers: [
        LoggerService,
        DataService,
        QrScannerService,
        ConfigService,
        { provide: PassService, useValue: mockPassService },
      ],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PassCheckInListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sort active pass to front of passes array', () => {
    mockChange.passes.currentValue[1].passStatus = 'active';
    component.ngOnChanges(mockChange as any);
    expect(component.passes.length).toEqual(2);
    expect(component.passes[0].submitLoading).toEqual(false);
    expect(component.passes[1].submitLoading).toEqual(false);
    expect(component.passes[0].pk).toEqual(MockData.mockPass_2.pk);
    expect(component.passes[1].pk).toEqual(MockData.mockPass_1.pk);
  });

  it('should handle invalid change', () => {
    const processPassSpy = spyOn(component, 'processPass');
    component.ngOnChanges(mockInvalidChange as any);
    expect(component.passes).toEqual([]);
    expect(processPassSpy).toHaveBeenCalledTimes(0);
  });

  it('should process pass', () => {
    const res = component.processPass({ ...MockData.mockPass_1 });
    expect(res.passState).toEqual(
      Constants.stateLabelDictionary[MockData.mockPass_1.passStatus]
    );

    const res2 = component.processPass({ ...MockData.mockPass_2 });
    expect(res2.passState).toEqual(
      Constants.stateLabelDictionary[MockData.mockPass_2.passStatus]
    );
  });

  it('should check in pass', async () => {
    const checkedOutPass = { ...MockData.mockPass_1 };
    checkedOutPass.passStatus = 'active';
    component.passes = [{ ...MockData.mockPass_1 }];
    await component.checkIn(checkedOutPass);

    expect(component.passes[0]).toEqual(mockPassCheckedIn);
  });

  it('should check out pass', async () => {
    const checkedInPass = { ...MockData.mockPass_1 };
    checkedInPass.passStatus = 'checkedIn';

    component.passes = [{ ...MockData.mockPass_1 }];
    await component.checkIn(checkedInPass);

    expect(component.passes[0]).toEqual(mockPassCheckedOut);
  });

  it('should update pass list', () => {
    const processPassSpy = spyOn(component, 'processPass');
    component.passes = [{ ...MockData.mockPass_1 }];
    component.updatePassList({ ...MockData.mockPass_1 });
    expect(processPassSpy).toHaveBeenCalledTimes(1);
  });
});
