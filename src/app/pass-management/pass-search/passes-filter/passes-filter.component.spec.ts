import { HttpClient, HttpHandler } from '@angular/common/http';
import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { DataService } from 'src/app/services/data.service';
import { MockData } from 'src/app/shared/utils/mock-data';

import { PassesFilterComponent } from './passes-filter.component';
import { FacilityService } from 'src/app/services/facility.service';
import { Constants } from 'src/app/shared/utils/constants';

describe('PassesFilterComponent', () => {
  let component: PassesFilterComponent;
  let fixture: ComponentFixture<PassesFilterComponent>;
  let location: Location;

  let mockFacility = MockData.mockFacility_1;
  let mockFacilityKey = { pk: mockFacility.pk, sk: mockFacility.sk }

  let mockParkAndFacility = MockData.mockParkFacility_1;

  let mockPartialPassFilter = MockData.mockPartialPassFilters_1;
  let mockFullPassFilter = MockData.mockFullPassFilters_1;

  let mockSubject = new BehaviorSubject(mockFacility);

  let mockFacilityService = {
    getCachedFacility: (key) => {
      if (key.pk === mockFacilityKey.pk && key.sk === mockFacilityKey.sk) {
        return mockFacility;
      }
      return null;
    },
  };

  let mockDataService = {
    watchItem: (id) => {
      if (id === Constants.dataIds.PARK_AND_FACILITY_LIST) {
        return new BehaviorSubject(mockParkAndFacility);
      }
      return new BehaviorSubject(null);
    },
    getItemValue: (id) => {
      if (id === Constants.dataIds.PARK_AND_FACILITY_LIST) {
        return mockParkAndFacility;
      }
      return null;
    },
    setItemValue: (id, value) => {
      // do nothing, see if I even care
      return;
    },

  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PassesFilterComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: 'passType', component: PassesFilterComponent },
        ]),
      ],
      providers: [
        HttpClient,
        HttpHandler,
        ConfigService,
        { provide: DataService, useValue: mockDataService },
        { provide: FacilityService, useValue: mockFacilityService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PassesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    location = TestBed.inject(Location);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('builds picklists', async () => {
    component.createParksOptions();
    expect(component.parkOptions).toEqual([
      {
        value: 'MOC1', display: 'Mock Park 1'
      },
      {
        value: 'MOC2', display: 'Mock Park 2'
      },
    ])
    component.createFacilitiesOptions('MOC1');
    expect(component.facilityOptions).toEqual([
      {
        value: 'Mock Facility 1', display: 'Mock Facility 1'
      },
      {
        value: 'Mock Facility 2', display: 'Mock Facility 2'
      }
    ])
    component.createPassTypeOptions('MOC1', 'Mock Facility 1');
    expect(component.passTypeOptions).toEqual([
      {
        value: 'AM', display: 'AM'
      },
      {
        value: 'PM', display: 'PM'
      },
    ])
  });

  it('submits filter selections', async () => {
    const passServiceSpy = spyOn(component['passService'], 'fetchData');
    expect(passServiceSpy).not.toHaveBeenCalled();
    component.data = mockPartialPassFilter;
    component.setForm();
    await fixture.isStable();
    await component.onSubmit();
    // overbooked = all is default
    expect(location.path()).toBe('/?park=MOC1&facilityName=Mock%20Facility%201&passType=AM&overbooked=all');
    expect(passServiceSpy).toHaveBeenCalledOnceWith({
      passType: 'AM',
      facilityName: 'Mock Facility 1',
      park: 'MOC1',
      overbooked: 'all'
    });
    // full pass checklist
    component.data = mockFullPassFilter;
    passServiceSpy.calls.reset();
    component.setForm();
    await fixture.isStable();
    await component.onSubmit();
    expect(location.path()).toBe('/?date=2022-12-19&park=MOC1&facilityName=Mock%20Facility%201&passType=AM&passStatus=reserved&firstName=firstName&lastName=lastName&email=mock@email.ca&reservationNumber=1234567890&overbooked=all');
    expect(passServiceSpy).toHaveBeenCalledOnceWith({
      date: '2022-12-19',
      park: 'MOC1',
      passType: 'AM',
      passStatus: 'reserved',
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'mock@email.ca',
      reservationNumber: '1234567890',
      overbooked: 'all',
      facilityName: 'Mock Facility 1',
    })
  });

  it('updates the field', async () => {
    const facilityListSpy = spyOn(component, 'createFacilitiesOptions');
    component.data = {
      park: 'NEWMOC'
    }
    component.updateFormFields();
    expect(component.form.get('park').value).toBe('NEWMOC');
    expect(facilityListSpy).not.toHaveBeenCalled();
  })

  it('clears the field', async () => {
    const resetSpy = spyOn(component, 'reset');
    component.clearForm();
    expect(resetSpy).toHaveBeenCalled();
    expect(component.data.park).toBe(null);
  });

  it('checks if mandatory fields are non-null', async () => {
    expect(component.checkFieldsForSubmission()).toBeFalse();
    component.data = {
      park: 'MOC1',
      facilityName: 'Mock Facility 1',
      passType: 'DAY',
    }
    component.setForm();
    expect(component.checkFieldsForSubmission()).toBeTrue();
  });

  it('validates the fields', async () => {
    const res1 = await component.submit();
    expect(component.validateFields(res1.fields)).toBeFalse();
    component.data = mockFullPassFilter;
    component.setForm();
    const res2 = await component.submit();
    expect(component.validateFields(res2.fields)).toBeTrue();
  })

});
