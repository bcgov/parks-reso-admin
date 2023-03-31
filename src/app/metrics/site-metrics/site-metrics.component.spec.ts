import { HttpClientModule } from '@angular/common/http';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ConfigService } from 'src/app/services/config.service';
import { Constants } from '../../shared/utils/constants';
import { BehaviorSubject } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { MockData } from 'src/app/shared/utils/mock-data';

import { SiteMetricsComponent } from './site-metrics.component';
import { SharedMetricsModule } from '../../shared/components/metrics/shared-metrics.module';

describe('SiteMetricsComponent', () => {
  let component: SiteMetricsComponent;
  let fixture: ComponentFixture<SiteMetricsComponent>;

  let buildSpy;
  const testSk = '37bbecdf38089efe13af862dc9d6f460'


  let mockParksAndFacilities = MockData.mockParkFacility_1;
  let mockDateRange = ['2023-01-30', '2023-02-01'];
  let mockMetricsData = MockData.mockMetrics1;
  let mockMetricsParams = {
    timeSpan: null,
    park: MockData.mockPark_1.sk,
    facility: MockData.mockFacility_1.sk,
    dateRange: mockDateRange
  }

  let fakeDataService = {
    watchItem: (id) => {
      if (id === Constants.dataIds.CURRENT_METRICS)
        return new BehaviorSubject([mockMetricsData]);
      if (id === Constants.dataIds.METRICS_FILTERS_PARAMS)
        return new BehaviorSubject(mockMetricsParams);
      if (id === Constants.dataIds.PARK_AND_FACILITY_LIST)
        return new BehaviorSubject(mockParksAndFacilities);
      return new BehaviorSubject(null);
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SiteMetricsComponent],
      imports: [HttpClientModule, SharedMetricsModule],
      providers: [
        ConfigService,
        { provide: DataService, useValue: fakeDataService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SiteMetricsComponent);
    component = fixture.componentInstance;
    buildSpy = spyOn(component, 'buildDoughnutChart').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.isGenerating).toBeFalse();
    expect(buildSpy).toHaveBeenCalledTimes(0);
  });

  it('should parse statusData', async () => {
    component.getStatusData();
    await fixture.isStable();
    fixture.detectChanges();
    expect(component['passTotals']).toEqual({
      active: 5,
      reserved: 3,
      expired: 1,
      cancelled: 4,
      total: 9
    });
  });

  it('should parse capacityData', async () => {
    let date = mockMetricsData.sk;
    component.dateInterval = component.createDateInterval(date, date);
    let capacityData = component.getCapacityData();
    await fixture.isStable();
    fixture.detectChanges();
    expect(capacityData).toEqual({
      [date]: {
        booked: 9,
        capacity: 24,
        cancelled: 4
      }
    });
  });



  it('should test when API call finds no export report', async () => {
    let toastService = spyOn(component['toastService'], 'addMessage')
    let apiSpy = spyOn(component['apiService'], 'get').and.returnValue(
      new BehaviorSubject({
        status: 'Job not found',
        sk: testSk
      })
    );

    component.getPassExport(testSk)
    await fixture.isStable();
    fixture.detectChanges();

    expect(apiSpy).toHaveBeenCalledTimes(1);
    expect(component.isGenerating).toBeFalse();
    expect(component.signedURL).toBeUndefined();
    expect(component.buttonText).toBe('Export Pass Data');
    expect(toastService).toHaveBeenCalledWith(
      `Sorry, that didn't work. Please try again.`,
      'Export Service',
      Constants.ToastTypes.ERROR
    )
  })

  it('should test when API call finds export report ready', fakeAsync(async () => {
    let testSignedURL = 'www.google.ca'
    let toastService = spyOn(component['toastService'], 'addMessage')
    let apiSpy = spyOn(component['apiService'], 'get').and.returnValue(
      new BehaviorSubject({
        status: 'Job complete',
        sk: testSk,
        signedURL: testSignedURL,
        jobObj: {
          progressPercentage: 100
        }
      })
    );
    let windowSpy = spyOn(window, 'open')

    component.getPassExport(testSk)
    await fixture.isStable();
    fixture.detectChanges();

    expect(apiSpy).toHaveBeenCalledTimes(1);
    expect(component.isGenerating).toBeFalse();
    expect(component.signedURL).toEqual(testSignedURL);
    expect(component.buttonText).toBe('Export Pass Data');
    expect(toastService).toHaveBeenCalledWith(
      `Your report is downloading.`,
      'Export Service',
      Constants.ToastTypes.SUCCESS
    )

    tick(5500)
    expect(windowSpy).toHaveBeenCalledOnceWith(
      testSignedURL, '_blank'
    )
  }))

  it('should unsubscribe on destroy', async () => {
    const subSpy = spyOn<any>(component['subscriptions'], 'unsubscribe');
    component.ngOnDestroy();
    expect(subSpy).toHaveBeenCalledTimes(1);
  });
});
