import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Constants } from '../../shared/utils/constants';
import { ConfigService } from 'src/app/services/config.service';
import { DataService } from 'src/app/services/data.service';
import { MockData } from 'src/app/shared/utils/mock-data';
import { BehaviorSubject } from 'rxjs';

import { MetricsFilterComponent } from './metrics-filter.component';
import { SharedMetricsModule } from '../../shared/components/metrics/shared-metrics.module';
import { DsFormsModule } from '../../shared/components/ds-forms/ds-forms.module'

describe('MetricsFilterComponent', () => {
  let component: MetricsFilterComponent;
  let fixture: ComponentFixture<MetricsFilterComponent>;

  let mockData = MockData.mockParkFacility_1

  let mockPark1 = MockData.mockPark_1;
  let mockPark2 = MockData.mockPark_2;

  let mockFacility1 = MockData.mockFacility_1
  let mockFacility2 = MockData.mockFacility_2
  let mockFacility3 = MockData.mockFacility_3

  let mockDataService = {
    watchItem: (id) => {
      if (id === Constants.dataIds.PARK_AND_FACILITY_LIST) {
        return new BehaviorSubject(mockData); 
      } else if (id === Constants.dataIds.METRICS_FILTERS_PARAMS) {
        return new BehaviorSubject([mockFacility1,mockFacility2,mockFacility3])
      }
      return new BehaviorSubject(null);
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MetricsFilterComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        SharedMetricsModule,
        DsFormsModule
      ],
      providers: [
        ConfigService,
        { provide: DataService, useValue: mockDataService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MetricsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial values', () => {
    expect(component.timeSpanOptions).toEqual(['year', 'month', 'week']);
    expect(component.timeSpanLabels).toEqual(['12M', '30D', '7D']);
    expect(component.fileTypeOptions).toEqual([
      { value: 'pdf', display: 'PDF' },
      { value: 'csv', display: 'CSV' },
      { value: 'json', display: 'JSON' },
    ]);
  });

  it('should toggle outputs to true', () => {
    component.selectAllExports(false);
    component.selectAllExports(true);

    expect(component.fields.exportBusiestDays.value).toBeTrue();
    expect(component.fields.exportPassActivityByDay.value).toBeTrue();
    expect(component.fields.exportPassTrendsByHour.value).toBeTrue();
    expect(component.fields.exportPassBreakdownByStatus.value).toBeTrue();
    expect(component.fields.exportReturningGuests.value).toBeTrue();
  });

  it('should toggle outputs to false', () => {
    component.selectAllExports(true);
    component.selectAllExports(false);

    expect(component.fields.exportBusiestDays.value).toBeFalse();
    expect(component.fields.exportPassActivityByDay.value).toBeFalse();
    expect(component.fields.exportPassTrendsByHour.value).toBeFalse();
    expect(component.fields.exportPassBreakdownByStatus.value).toBeFalse();
    expect(component.fields.exportReturningGuests.value).toBeFalse();
  });

  it('should populate park list', () => {
    let tempParkOptions = []
    for (const park of Object.keys(component.parkFacilitiesList)) {
      tempParkOptions.push({ value: park, display: component.parkFacilitiesList[park].name });
    }
    expect(component.parkOptions).toEqual(tempParkOptions)
  })
});
