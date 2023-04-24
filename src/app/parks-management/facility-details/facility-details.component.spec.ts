import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { DataService } from 'src/app/services/data.service';
import { MockData } from 'src/app/shared/utils/mock-data';

import { FacilityDetailsComponent } from './facility-details.component';
import { FacilityService } from 'src/app/services/facility.service';

describe('FacilityDetailsComponent', () => {
  let component: FacilityDetailsComponent;
  let fixture: ComponentFixture<FacilityDetailsComponent>;

  let testFacility = MockData.mockFacility_1;

  let testSubject = new BehaviorSubject(testFacility);
  let mockFacilityKey = { pk: testFacility.pk, sk: testFacility.sk };

  let fakeDataService = {
    watchItem: () => {
      return testSubject;
    },
  };

  let mockFacilityService = {
    getCachedFacility: (facilityKey) => {
      if (facilityKey.pk === mockFacilityKey.pk && facilityKey.sk === mockFacilityKey.sk) {
        return testFacility;
      }
      return null;
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FacilityDetailsComponent],
      providers: [
        HttpClient,
        HttpHandler,
        ConfigService,
        { provide: DataService, useValue: fakeDataService },
        { provide: FacilityService, useValue: mockFacilityService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FacilityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.facility).toBeDefined();
  });

  it('renders in the DOM properly', async () => {
    const elements = fixture.debugElement.nativeElement.getElementsByTagName('p');
    expect(elements[0].innerText).toEqual('Open');
    expect(elements[1].innerText).toEqual('True');
    expect(elements[2].innerText).toEqual('-');
    expect(elements[3].innerText).toEqual('Disabled');
    expect(elements[4].innerText).toEqual('7 AM');
    expect(elements[5].innerText).toEqual('2 days');
    expect(elements[6].innerText).toEqual('5');
    expect(elements[7].innerText).toEqual('Trail');
  });
});
