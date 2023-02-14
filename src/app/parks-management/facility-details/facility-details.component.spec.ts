import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { DataService } from 'src/app/services/data.service';
import { MockData } from 'src/app/shared/utils/mock-data';

import { FacilityDetailsComponent } from './facility-details.component';

describe('FacilityDetailsComponent', () => {
  let component: FacilityDetailsComponent;
  let fixture: ComponentFixture<FacilityDetailsComponent>;

  let testFacility = MockData.mockFacility_1;

  let testSubject = new BehaviorSubject(testFacility);

  let fakeDataService = {
    watchItem: () => {
      return testSubject;
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FacilityDetailsComponent],
      providers: [
        HttpClient,
        HttpHandler,
        ConfigService,
        { provide: DataService, useValue: fakeDataService },
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
    console.log('elements:', elements);
    expect(elements[0].innerText).toEqual('Open');
    expect(elements[1].innerText).toEqual('True');
    expect(elements[2].innerText).toEqual('-');
    expect(elements[3].innerText).toEqual('Trail');
    expect(elements[4].innerText).toEqual('7 AM');
    expect(elements[5].innerText).toEqual('2 days');
    expect(elements[6].innerText).toEqual('5');
    expect(elements[7].innerText).toEqual('3');
  });
});
