import { HttpClient, HttpHandler } from '@angular/common/http';
import { Location } from '@angular/common';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { DataService } from 'src/app/services/data.service';
import { KeycloakService } from 'src/app/services/keycloak.service';
import { Constants } from 'src/app/shared/utils/constants';
import { MockData } from 'src/app/shared/utils/mock-data';
import { ParkDetailsComponent } from './park-details.component';
import { By } from '@angular/platform-browser';

describe('ParkDetailsComponent', () => {
  let component: ParkDetailsComponent;
  let fixture: ComponentFixture<ParkDetailsComponent>;

  let mockFacility1 = MockData.mockFacility_1;
  let mockFacility2 = MockData.mockFacility_2;

  let mockPark = MockData.mockPark_1;

  let mockDataService = {
    watchItem: (id) => {
      if (id === Constants.dataIds.CURRENT_PARK) {
        return new BehaviorSubject(mockPark);
      }
      if (id === Constants.dataIds.FACILITIES_LIST) {
        return new BehaviorSubject([mockFacility1, mockFacility2]);
      }
      return new BehaviorSubject(null);
    },
  };

  let mockKeyCloakService = {
    isAllowed: (perm) => {
      if (perm === 'add-facility') {
        return true;
      }
      return false;
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParkDetailsComponent],
      imports: [RouterTestingModule],
      providers: [
        HttpClient,
        HttpHandler,
        ConfigService,
        KeycloakService,
        RouterTestingModule,
        { provide: DataService, useValue: mockDataService },
        { provide: KeycloakService, useValue: mockKeyCloakService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ParkDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.tableRows.length).toEqual(2);
    expect(component.park).toBeDefined();
    expect(component.addFacilityButtonConfig).toEqual({
      active: true,
      text: 'Add Facility',
      nav: 'add-facility',
      hidden: false,
    });
  });

  it('creates the facilites table', async () => {
    const columns = component.tableSchema.columns;
    expect(columns[0].mapValue(mockFacility1)).toEqual('Mock Facility 1');
    expect(columns[1].mapValue(mockFacility1)).toEqual('Trail');
    expect(columns[2].mapValue(mockFacility1)).toEqual('open');
    expect(columns[3].mapValue(mockFacility1)).toEqual(true);
    expect(columns[4].mapValue(mockFacility1)).toBeNull();
    // row click goes to details page
    const navSpy = spyOn(component['router'], 'navigate');
    const rowFunc = component.tableSchema.rowClick(mockFacility1);
    rowFunc();
    expect(navSpy).toHaveBeenCalledOnceWith(['Mock Facility 1'], {
      relativeTo: component['route'],
    });
    // edit button in row
    navSpy.calls.reset();
    let editButton = columns[4].cellTemplate(mockFacility1);
    editButton.inputs.onClick();
    expect(navSpy).toHaveBeenCalledOnceWith(['Mock Facility 1/edit'], {
      relativeTo: component['route'],
    });
  });

  it('renders the DOM', async () => {
    // get display elements
    const displayElements = fixture.debugElement.queryAll(
      By.css(`.col-md-6`)
    );
    expect(displayElements[0].nativeElement.innerText).toContain('Passes are required at this park.')
    expect(displayElements[1].nativeElement.innerText).toContain('Not set')
    expect(displayElements[3].nativeElement.innerText).toContain('true')
    expect(displayElements[4].nativeElement.innerText).toContain(mockPark.bcParksLink)
    expect(displayElements[5].nativeElement.innerText).toContain(mockPark.mapLink)
  });
});
