import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { DataService } from 'src/app/services/data.service';
import { KeycloakService } from 'src/app/services/keycloak.service';
import { Constants } from 'src/app/shared/utils/constants';
import { MockData } from 'src/app/shared/utils/mock-data';
import { PassUtils } from 'src/app/utils/pass-utils';

import { PassesUtilityButtonsComponent } from './passes-utility-buttons.component';

describe('PassesUtilityButtonsComponent', () => {
  let component: PassesUtilityButtonsComponent;
  let fixture: ComponentFixture<PassesUtilityButtonsComponent>;

  let mockPass1 = MockData.mockPass_1;
  let mockPass2 = MockData.mockPass_2;

  let mockFacility = MockData.mockFacility_1;

  let mockPassFilters = MockData.mockFullPassFilters_1;

  let mockPassList = new BehaviorSubject([mockPass1, mockPass2]);

  let mockDataService = {
    watchItem: (id) => {
      if (id === Constants.dataIds.PASSES_LIST) {
        return mockPassList;
      }
      if (id === Constants.dataIds.CURRENT_FACILITY) {
        return new BehaviorSubject(mockFacility);
      }
      if (id === Constants.dataIds.PASS_SEARCH_PARAMS) {
        return new BehaviorSubject(mockPassFilters);
      }
      return null;
    },
  };

  let mockKeyCloakService = {
    isAllowed: () => {
      return true;
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PassesUtilityButtonsComponent],
      providers: [
        HttpClient,
        HttpHandler,
        ConfigService,
        { provide: KeycloakService, useValue: mockKeyCloakService },
        { provide: DataService, useValue: mockDataService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PassesUtilityButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.passes).toBeDefined();
    expect(component.facility).toBeDefined();
    expect(component['parkSk']).toBeDefined();
    expect(component['passFilterParams']).toBeDefined();
  });

  it('exports csv', async () => {
    let apiSpy = spyOn(component['apiService'], 'get').and.returnValue(
      new BehaviorSubject({
        res: {
          signedUrl: 'mockSignedUrl',
        },
      })
    );
    const windowSpy = spyOn(window, 'open');
    component.exportCsv();
    await fixture.isStable();
    expect(apiSpy).toHaveBeenCalledWith('export-pass', {
      facilityName: 'Mock Facility 1',
      park: 'MOC1',
      email: 'mock@email.ca',
      date: '2022-12-19',
      firstName: 'firstName',
      lastName: 'lastName',
      passStatus: 'reserved',
      reservationNumber: '1234567890',
    });
    expect(windowSpy).toHaveBeenCalledTimes(1);
  });

  it('shows error toast', async () => {
    const apiErrorSpy = spyOn(component['apiService'], 'get').and.throwError(
      'error'
    );
    const toastSpy = spyOn(component['toastService'], 'addMessage');
    component.exportCsv();
    await fixture.isStable();
    expect(apiErrorSpy).toThrowError();
    expect(toastSpy).toHaveBeenCalledTimes(1);
  });

  it('prints the page', async () => {
    const mockWindow = {
      document: { write: () => {}, close: () => {} },
      focus: () => {},
      print: () => {},
      close: () => {},
    } as unknown as Window;
    const windowSpy = spyOn(window, 'open').and.returnValue(mockWindow);
    component.print();
    // Expect two rows in the table
    const tableBodyElement =
      fixture.debugElement.nativeElement.querySelector('tbody');
    const tableRowElements = tableBodyElement.getElementsByTagName('tr');
    expect(tableRowElements.length).toEqual(2);
  });

  it('copies emails to clipboard', async () => {
    const utilSpy = spyOn(PassUtils, 'copyEmailToClipboard');
    const toastSpy = spyOn(component['toastService'], 'addMessage');
    component.copyEmails();
    expect(utilSpy).toHaveBeenCalledTimes(1);
    expect(toastSpy).toHaveBeenCalledTimes(1);
  });
});
