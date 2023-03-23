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

  let testMetricsData1 = MockData.metricsData1;
  let testMetricsData2 = MockData.metricsData2;

  let testSubject = new BehaviorSubject(testMetricsData1);

  let fakeDataService = {
    watchItem: () => {
      return testSubject;
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
    buildSpy = spyOn(component, 'buildCharts').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.isGenerating).toBeFalse();
    expect(buildSpy).toHaveBeenCalledTimes(0);
  });

  it('should load metrics data into component', async () => {
    let data = testMetricsData1;
    expect(component.passActive).toEqual(data.active);
    expect(component.passExpired).toEqual(data.expired);
    expect(component.passReserved).toEqual(data.reserved);
    expect(component.passExpired).toEqual(data.expired);
  });

  it('should update metrics with new data', async () => {
    let data = testMetricsData2;

    component.buildCharts(data);

    await fixture.isStable();
    expect(component.passActive).toEqual(data.active);
    expect(component.passExpired).toEqual(data.expired);
    expect(component.passReserved).toEqual(data.reserved);
    expect(component.passExpired).toEqual(data.expired);
  });

  it('should handle generate export report click', fakeAsync(async () => {
    let getPassExportSpy = spyOn(component, 'getPassExport');
    let apiSpy = spyOn(component['apiService'], 'get').and.returnValue(
      new BehaviorSubject({
        status: 'Export job created',
        sk: '37bbecdf38089efe13af862dc9d6f460',
      })
    );

    const buttons =
      fixture.debugElement.nativeElement.querySelectorAll('button');
    buttons[0].click();
    tick(1200);
    await fixture.isStable();
    fixture.detectChanges();

    expect(getPassExportSpy).toHaveBeenCalledTimes(1);
    expect(apiSpy).toHaveBeenCalledTimes(1);
    expect(component.isGenerating).toBeTrue();
    expect(component.signedURL).toBeNull();
    expect(component.statusMessage).toBeTruthy();
  }));

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
