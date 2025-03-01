import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { DataService } from 'src/app/services/data.service';
import { Constants } from 'src/app/shared/utils/constants';
import { MockData } from 'src/app/shared/utils/mock-data';

import { FacilityEditComponent } from './facility-edit.component';
import { ParkService } from 'src/app/services/park.service';
import { FacilityService } from 'src/app/services/facility.service';

describe('FacilityEditComponent', () => {
  let component: FacilityEditComponent;
  let fixture: ComponentFixture<FacilityEditComponent>;

  let mockFacility = MockData.mockFacility_1;
  let mockFacilityKey = { pk: mockFacility.pk, sk: mockFacility.sk };
  let mockPark = MockData.mockPark_1;
  let mockParkKey = { pk: mockPark.pk, sk: mockPark.sk };

  let mockDataService = {
    watchItem: (id) => {
      if (id === Constants.dataIds.CURRENT_FACILITY_KEY) {
        return new BehaviorSubject(mockFacilityKey);
      }
      if (id === Constants.dataIds.CURRENT_PARK_KEY) {
        return new BehaviorSubject(mockParkKey);
      }
      return null;
    },
  };

  let mockParkService = {
    getCachedPark: (key) => {
      if (key.pk === mockParkKey.pk && key.sk === mockParkKey.sk) {
        return mockPark;
      }
      return null;
    },
  };

  let mockFacilityService = {
    getCachedFacility: (key) => {
      if (key.pk === mockFacilityKey.pk && key.sk === mockFacilityKey.sk) {
        return mockFacility;
      }
      return null;
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [FacilityEditComponent],
    providers: [
        HttpClient,
        HttpHandler,
        ConfigService,
        { provide: DataService, useValue: mockDataService },
        { provide: ParkService, useValue: mockParkService },
        { provide: FacilityService, useValue: mockFacilityService },
    ],
}).compileComponents();

    fixture = TestBed.createComponent(FacilityEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updates modifiers', async () => {
    const modifierSpy = spyOn(component['modifierService'], 'fetchData');
    spyOn(component['utils'], 'getTodaysDate').and.returnValue('2022-12-20');
    component.updateModifiers('MOC1', 'Mock Facility 1');
    expect(modifierSpy).toHaveBeenCalledOnceWith(
      'MOC1',
      'Mock Facility 1',
      '2022-12-20'
    );
  });
});
