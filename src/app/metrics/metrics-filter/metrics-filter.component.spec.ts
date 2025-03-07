import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Constants } from '../../shared/utils/constants';
import { ConfigService } from 'src/app/services/config.service';
import { DataService } from 'src/app/services/data.service';
import { MockData } from 'src/app/shared/utils/mock-data';
import { BehaviorSubject } from 'rxjs';

import { MetricsFilterComponent } from './metrics-filter.component';
import { DsFormsModule } from '../../shared/components/ds-forms/ds-forms.module'
import { RouterTestingModule } from '@angular/router/testing';

describe('MetricsFilterComponent', () => {
  let component: MetricsFilterComponent;
  let fixture: ComponentFixture<MetricsFilterComponent>;

  let mockData = MockData.mockParkFacility_1

  let mockPark1 = MockData.mockPark_1;

  let mockDateRange = ['2023-01-31', '2023-02-01'];

  let mockFacility1 = MockData.mockFacility_1;

  let mockDataService = {
    watchItem: (id) => {
      if (id === Constants.dataIds.PARK_AND_FACILITY_LIST) {
        return new BehaviorSubject(mockData);
      }
      return new BehaviorSubject(null);
    },
    getItemValue: (id) => {
      if (id === Constants.dataIds.METRICS_FILTERS_PARAMS) {
        return new BehaviorSubject({
          dateRange: mockDateRange,
          park: mockPark1.sk,
          facility: mockFacility1.sk
        })
      }
      if (id === Constants.dataIds.PARK_AND_FACILITY_LIST) {
        return mockData;
      }
      return new BehaviorSubject(null);
    },
    setItemValue: () => {
      // Stub
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ReactiveFormsModule,
        FormsModule,
        DsFormsModule,
        RouterTestingModule,
        MetricsFilterComponent],
    providers: [
        ConfigService,
        { provide: DataService, useValue: mockDataService },
        provideHttpClient(withInterceptorsFromDi())
    ]
}).compileComponents();

    fixture = TestBed.createComponent(MetricsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial values', () => {
    expect(component.timeSpanOptions).toEqual(['week', 'month', 'year']);
    expect(component.timeSpanLabels).toEqual(['7D', '30D', '12M']);
  });

  it('should populate park list', async () => {
    let tempParkOptions = [
      { value: 'all', display: 'All Parks' },
      { value: null, display: null, disabled: true, breakpoint: true }
    ];
    for (const park of Object.keys(component.parkFacilitiesList)) {
      tempParkOptions.push({ value: park, display: component.parkFacilitiesList[park].name });
    }
    expect(component.parkOptions).toEqual(tempParkOptions)
  })

  it('should populate facility list', async () => {
    let tempFacilityOptions = [
      { value: 'all', display: 'All Facilities' },
      { value: null, display: null, disabled: true, breakpoint: true }
    ]
    const park = Object.keys(component.parkFacilitiesList)[0]
    let facilityList = component.parkFacilitiesList[park].facilities;
    for (const facility in facilityList) {
      tempFacilityOptions.push({ value: facilityList[facility].sk, display: facilityList[facility].name });
    }
    component.fields.park.setValue(park);
    expect(component.facilityOptions).toEqual(tempFacilityOptions)
  })

  it('validates metrics params', async () => {
    expect(component.validateMetricsParams({})).toBeFalse();
    expect(component.validateMetricsParams({ park: mockPark1.orcs })).toBeFalse();
    expect(component.validateMetricsParams({ park: mockPark1.orcs, dateRange: mockDateRange, facility: mockFacility1.sk })).toBeTrue();
  })

  it('submits data correctly', async () => {
    const params = { park: mockPark1.orcs, dateRange: mockDateRange, facility: mockFacility1.sk };
    const filterSpy = spyOn(component['metricsService'], 'setFilterParams');
    await component.onSubmit(params);
    expect(filterSpy).not.toHaveBeenCalled();
    component.fields.park.setValue('all');
    filterSpy.calls.reset();
    component.fields.dateRange.setValue(mockDateRange);
    await component.onSubmit(params);
    expect(filterSpy).toHaveBeenCalledWith({
      timeSpan: null,
      park: 'all',
      dateRange: mockDateRange,
      facility: null
    });
    component.fields.park.setValue(mockPark1.sk);
    filterSpy.calls.reset();
    component.fields.facility.setValue(mockFacility1.sk);
    const dataSpy = spyOn(component['metricsService'], 'fetchData');
    await component.onSubmit(params);
    expect(filterSpy).toHaveBeenCalledWith({
      timeSpan: null,
      park: mockPark1.sk,
      dateRange: mockDateRange,
      facility: mockFacility1.sk
    });
    expect(dataSpy).toHaveBeenCalledWith(
      mockDateRange[0], mockDateRange[1], mockPark1.sk, mockFacility1.sk
    )
  })

});
