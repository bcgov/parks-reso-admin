import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { DataService } from 'src/app/services/data.service';
import { Constants } from 'src/app/shared/utils/constants';
import { MockData } from 'src/app/shared/utils/mock-data';

import { ModifiersFormComponent } from './modifiers-form.component';
import { ParkService } from 'src/app/services/park.service';
import { FacilityService } from 'src/app/services/facility.service';

describe('ModifiersFormComponent', () => {
  let component: ModifiersFormComponent;
  let fixture: ComponentFixture<ModifiersFormComponent>;

  let mockFacility = MockData.mockFacility_1;
  let mockFacilityKey = { pk: mockFacility.pk, sk: mockFacility.sk };
  let mockPark = MockData.mockPark_1;
  let mockParkKey = { pk: mockPark.pk, sk: mockPark.sk };

  let mockParkService = {
    getCachedPark: (key) => {
      if (key.pk === mockParkKey.pk && key.sk === mockParkKey.sk) {
        return mockPark;
      }
      return null;
    }
  }

  let mockFacilityService = {
    getCachedFacility: (key) => {
      if (key.pk === mockFacilityKey.pk && key.sk === mockFacilityKey.sk) {
        return mockFacility;
      }
      return null;
    },
  }

  let mockDataService = {
    watchItem: (id) => {
      if (id === Constants.dataIds.CURRENT_FACILITY_KEY) {
        return new BehaviorSubject(mockFacility);
      }
      if (id === Constants.dataIds.CURRENT_PARK_KEY) {
        return new BehaviorSubject(mockPark);
      }
      return new BehaviorSubject(null);
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [FormsModule, ReactiveFormsModule, ModifiersFormComponent],
    providers: [
        HttpClient,
        HttpHandler,
        ConfigService,
        { provide: DataService, useValue: mockDataService },
        { provide: ParkService, useValue: mockParkService },
        { provide: FacilityService, useValue: mockFacilityService },
    ],
}).compileComponents();

    fixture = TestBed.createComponent(ModifiersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
    expect(component.facility).toBeDefined();
    expect(component.park).toBeDefined();
    expect(component.hasAM.value).toBeTrue();
    expect(component.hasPM.value).toBeTrue();
    expect(component.hasDAY.value).toBeFalse();
  });

  it('formats form results', async () => {
    component.form.controls['modifierOverrideDate'].setValue('2022-12-21');
    component.form.controls['modifierAMChanges'].setValue(8);
    component.form.controls['modifierPMChanges'].setValue(-1);
    component.form.controls['modifierDAYChanges'].setValue(2);
    const modifierServiceSpy = spyOn(
      component['modifierService'],
      'setModifier'
    );
    await component.onSubmit();
    expect(modifierServiceSpy).toHaveBeenCalledOnceWith({
      date: '2022-12-21',
      bookingTimes: {
        AM: 8,
        PM: -1,
        DAY: 2,
      },
      parkOrcs: 'MOC1',
      facility: 'Mock Facility 1',
    });
  });
});
