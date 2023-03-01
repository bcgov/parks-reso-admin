import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { DataService } from 'src/app/services/data.service';
import { PassService } from 'src/app/services/pass.service';
import { Constants } from 'src/app/shared/utils/constants';
import { MockData } from 'src/app/shared/utils/mock-data';

import { ManualEntryComponent } from './manual-entry.component';

describe('ManualEntryComponent', () => {
  let component: ManualEntryComponent;
  let fixture: ComponentFixture<ManualEntryComponent>;

  const mockFormGroup = new FormGroup({
    date: new FormControl({
      value: '2023-03-01',
      disabled: true,
    }),
    park: new FormControl(''),
    facilityName: new FormControl({ value: '', disabled: true }),
    registrationNumber: new FormControl({
      value: '',
      disabled: true,
    }),
    firstName: new FormControl({ value: '', disabled: true }),
    lastName: new FormControl({ value: '', disabled: true }),
    email: new FormControl({ value: '', disabled: true }),
  });

  const mockCompletedFormGroup = new FormGroup({
    date: new FormControl({
      value: '2023-03-01',
      disabled: true,
    }),
    park: new FormControl(MockData.mockPass_1['pk'].split('::')[1]),
    facilityName: new FormControl(MockData.mockPass_1.facilityName),
    registrationNumber: new FormControl(MockData.mockPass_1.registrationNumber),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
  });

  let mockPassService = {
    fetchData: (obj) => {
      return [MockData.mockPass_1];
    },
  };

  let mockDataService = {
    watchItem: (id) => {
      if (id === Constants.dataIds.PARK_AND_FACILITY_LIST) {
        return new BehaviorSubject(MockData.mockParkFacility_1);
      }
      return new BehaviorSubject(null);
    },
    getItemValue: (id) => {
      return null;
    },
    setItemValue: (id, value) => {},
  };

  let mockDataServiceWithCache = {
    watchItem: (id) => {
      if (id === Constants.dataIds.PARK_AND_FACILITY_LIST) {
        return new BehaviorSubject(MockData.mockParkFacility_1);
      }
      return new BehaviorSubject(null);
    },
    getItemValue: (id) => {
      if (id === Constants.dataIds.PASS_LOOKUP_PARK_SELECT_CACHE) {
        return MockData.mockParkFacility_1.MOC1.orcs;
      } else if (id === Constants.dataIds.PASS_LOOKUP_FACILITY_SELECT_CACHE) {
        return MockData.mockParkFacility_1.MOC1.facilities['Mock Facility 1']
          .pk;
      } else {
        return null;
      }
    },
    setItemValue: (value) => {
      return MockData.mockParkFacility_1.MOC1.facilities['Mock Facility 1'].pk;
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManualEntryComponent],
      imports: [HttpClientTestingModule, FormsModule, ReactiveFormsModule],
      providers: [
        ConfigService,
        { provide: PassService, useValue: mockPassService },
        { provide: DataService, useValue: mockDataService },
      ],
    }).compileComponents();
  });

  it('should create', async () => {
    fixture = TestBed.createComponent(ManualEntryComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should build form without cache', async () => {
    fixture = TestBed.createComponent(ManualEntryComponent);
    component = fixture.componentInstance;

    const getItemValueSpy = spyOn(mockDataService, 'getItemValue');
    const onParkSelectSpy = spyOn(component, 'onParkSelect');
    const onFacilitySelectSpy = spyOn(component, 'onFacilitySelect');

    // Use default mockDataService
    component.buildForm();
    expect(getItemValueSpy).toHaveBeenCalledOnceWith(
      Constants.dataIds.PASS_LOOKUP_PARK_SELECT_CACHE
    );
    expect(onParkSelectSpy).toHaveBeenCalledTimes(0);
    expect(onFacilitySelectSpy).toHaveBeenCalledTimes(0);
  });

  it('should build form with cache', async () => {
    TestBed.overrideProvider(DataService, {
      useValue: mockDataServiceWithCache,
    });

    fixture = TestBed.createComponent(ManualEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.searchForm.get('park').value).toEqual(
      MockData.mockParkFacility_1.MOC1.orcs
    );
    expect(component.searchForm.get('facilityName').value).toEqual(
      MockData.mockParkFacility_1.MOC1.facilities['Mock Facility 1'].pk
    );
  });

  it('should enable facilities field on park select', async () => {
    fixture = TestBed.createComponent(ManualEntryComponent);
    component = fixture.componentInstance;

    const setItemValueSpy = spyOn(mockDataService, 'setItemValue');

    component.searchForm = mockFormGroup;
    component.onParkSelect(MockData.mockPass_1['pk'].split('::')[1]);

    expect(component.searchForm.get('facilityName').enabled).toEqual(true);

    expect(setItemValueSpy).toHaveBeenCalledOnceWith(
      Constants.dataIds.PASS_LOOKUP_PARK_SELECT_CACHE,
      MockData.mockPass_1['pk'].split('::')[1]
    );
  });

  it('should enable filters field on facility select', async () => {
    fixture = TestBed.createComponent(ManualEntryComponent);
    component = fixture.componentInstance;

    const setItemValueSpy = spyOn(mockDataService, 'setItemValue');

    component.searchForm = mockFormGroup;
    component.onFacilitySelect(MockData.mockPass_1.facilityName);

    expect(component.searchForm.get('registrationNumber').enabled).toEqual(
      true
    );
    expect(component.searchForm.get('firstName').enabled).toEqual(true);
    expect(component.searchForm.get('lastName').enabled).toEqual(true);
    expect(component.searchForm.get('email').enabled).toEqual(true);

    expect(setItemValueSpy).toHaveBeenCalledOnceWith(
      Constants.dataIds.PASS_LOOKUP_FACILITY_SELECT_CACHE,
      MockData.mockPass_1.facilityName
    );
  });

  it('should enable submit on filter select', async () => {
    fixture = TestBed.createComponent(ManualEntryComponent);
    component = fixture.componentInstance;

    component.disableSubmit = true;
    component.searchForm = mockFormGroup;
    component.searchForm
      .get('registrationNumber')
      .setValue(MockData.mockPass_1.registrationNumber);
    component.onFilterSelect(component.searchForm.get('registrationNumber'));

    expect(component.disableSubmit).toEqual(false);
  });

  it('should search on submit', async () => {
    fixture = TestBed.createComponent(ManualEntryComponent);
    component = fixture.componentInstance;

    component.searchForm = mockCompletedFormGroup;
    await component.onSubmit();

    expect(component.noResults).toEqual(false);
    expect(component.disableSubmit).toEqual(false);
    expect(component.searching).toEqual(false);
  });
});
