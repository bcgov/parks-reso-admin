import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { DataService } from 'src/app/services/data.service';
import { Constants } from 'src/app/shared/utils/constants';
import { MockData } from 'src/app/shared/utils/mock-data';

import { FacilityEditComponent } from './facility-edit.component';

describe('FacilityEditComponent', () => {
  let component: FacilityEditComponent;
  let fixture: ComponentFixture<FacilityEditComponent>;

  let mockFacility = MockData.mockFacility_1;
  let mockPark = MockData.mockPark_1;

  let mockDataService = {
    watchItem: (id) => {
      if (id === Constants.dataIds.CURRENT_FACILITY) {
        return new BehaviorSubject(mockFacility);
      }
      if (id === Constants.dataIds.CURRENT_PARK) {
        return new BehaviorSubject(mockPark);
      }
      return null;
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FacilityEditComponent],
      providers: [
        HttpClient,
        HttpHandler,
        ConfigService,
        { provide: DataService, useValue: mockDataService },
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
    spyOn(component['utils'], 'getTodaysDate').and.returnValue(
      '2022-12-20'
    );
    component.updateModifiers();
    expect(modifierSpy).toHaveBeenCalledOnceWith(
      'MOC1',
      'Mock Facility 1',
      '2022-12-20'
    );
  });
});
