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

describe('PassesFilterComponent', () => {
  let component: PassesFilterComponent;
  let fixture: ComponentFixture<PassesFilterComponent>;
  let location: Location;

  let mockFacility = MockData.mockFacility_1;

  let mockPartialPassFilter = MockData.mockPartialPassFilters_1;

  let mockSubject = new BehaviorSubject(mockFacility);

  let mockDataService = {
    watchItem: () => {
      return mockSubject;
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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PassesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    location = TestBed.inject(Location);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component['facility']).toBeDefined();
    expect(component.bookingTimesList).toEqual([
      { value: 'AM', display: 'AM' },
      { value: 'PM', display: 'PM' },
    ]);
  });

  it('submits filter selections', async () => {
    const passServiceSpy = spyOn(component['passService'], 'fetchData');
    component.data = mockPartialPassFilter;
    component.setForm();
    await fixture.isStable();
    await component.onSubmit();
    expect(location.path()).toBe('/?passStatus=reserved&passType=Trail');
    expect(passServiceSpy).toHaveBeenCalledOnceWith({
      passType: 'Trail',
      park: 'MOC1',
      facilityName: 'Mock Facility 1',
      passStatus: 'reserved',
    });
  });
});
