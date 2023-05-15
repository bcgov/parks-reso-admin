import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from 'src/app/services/config.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { KeycloakService } from 'src/app/services/keycloak.service';
import { PassesListComponent } from './passes-list.component';
import { MockData } from 'src/app/shared/utils/mock-data';
import { BehaviorSubject } from 'rxjs';
import { Constants } from 'src/app/shared/utils/constants';
import { DataService } from 'src/app/services/data.service';
import { PassService } from 'src/app/services/pass.service';

describe('PassesListComponent', () => {
  let component: PassesListComponent;
  let fixture: ComponentFixture<PassesListComponent>;

  let mockPass1 = MockData.mockPass_1;
  let mockPass2 = MockData.mockPass_2;

  let mockPassList = new BehaviorSubject([mockPass1, mockPass2]);

  let mockPassLastEvaluatedKey = new BehaviorSubject({
    pk: {
      S: MockData.mockPass_1.pk,
    },
    sk: {
      S: MockData.mockPass_1.sk,
    },
  });

  let mockPassService = {
    fetchData: (obj) => {
      return new BehaviorSubject(null);
    },
    cancelPasses: (obj) => {
      return new BehaviorSubject(null);
    }
  }

  let mockDataService = {
    watchItem: (id) => {
      if (id === Constants.dataIds.PASSES_LIST) {
        return mockPassList;
      }
      if (id === Constants.dataIds.PASS_LAST_EVALUATED_KEY) {
        return mockPassLastEvaluatedKey;
      }
      return null;
    },
    mergeItemValue: (id, params) => {
      return new BehaviorSubject(null);
    },
    setItemValue: (id, params) => {
      return new BehaviorSubject(null);
    }
  };

  let mockKeyCloakService = {
    isAllowed: () => {
      return true;
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PassesListComponent],
      providers: [
        HttpClient,
        HttpHandler,
        ConfigService,
        BsModalService,
        { provide: KeycloakService, useValue: mockKeyCloakService },
        {
          provide: DataService,
          useValue: mockDataService,
        },
        { provide: PassService, useValue: mockPassService }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PassesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
    expect(component.tableRows).toBeDefined();
    expect(component.tableRows.length).toEqual(2);
    expect(component.lastEvaluatedKey).toBeDefined();
    // seven columns if cancellation allowed.
    const row = component.rowSchema;
    expect(row.length).toEqual(12);
    // check row values;
    expect(mockPass1[row[0].key]).toEqual('1234567890'); // pass id
    expect(mockPass1[row[1].key]).toEqual(4); // number of guests
    expect(mockPass1[row[2].key]).toEqual('2022-12-18'); // date
    expect(mockPass1[row[3].key]).toEqual('mock@email.ca'); // email
    expect(row[4].display(mockPass1)).toEqual('FirstName LastName'); // name
    expect(mockPass1[row[5].key]).toEqual('expired'); // status
    expect(mockPass1[row[6].key]).toBeTrue(); // checked in
    expect(mockPass1[row[7].key]).toBeFalse(); // is overbooked
    expect(mockPass1[row[8].key]).toEqual('Mock Park 1'); // park
    expect(mockPass1[row[9].key]).toEqual('Mock Facility 1'); // facility
    expect(mockPass1[row[10].key]).toEqual('PM'); // pass type
    expect(row[11].display(mockPass1)).toEqual('12/18/2022, 11:00 AM'); // checkinTime
  });

  it('creates cancel modal', async () => {
    component.displayCancelModal(mockPass1);
    const message = component.cancelModal.body;
    let body = document.createElement('div');
    body.innerHTML = message;
    const regNumber = body.querySelector('strong');
    expect(regNumber.innerText).toEqual('1234567890');
    const modalHideSpy = spyOn(component.cancelModalRef, 'hide');
    const cancelSpy = spyOn(component, 'cancelPass').and.callThrough();
    component.cancelModal.buttons[0].onClick();
    expect(modalHideSpy).toHaveBeenCalledTimes(1);
    expect(cancelSpy).toHaveBeenCalledTimes(1);
  });

  it('disables cancellation button', async () => {
    expect(component.disableCancelButton(mockPass1)).toBeTrue();
    expect(component.disableCancelButton(mockPass2)).toBeFalse();
  });

  it('loads more passes', async () => {
    const mergeItemSpy = spyOn(mockDataService, 'mergeItemValue');
    const fetchPassSpy = spyOn(mockPassService, 'fetchData');
    component.loadMorePasses();
    expect(mergeItemSpy).toHaveBeenCalledWith(
      Constants.dataIds.PASS_SEARCH_PARAMS,
      {
        ExclusiveStartKeyPK: 'pass::MOC1',
        ExclusiveStartKeySK: '1234567890',
        appendResults: true,
      }
    );
    expect(fetchPassSpy).toHaveBeenCalledTimes(1);
  });

  it('adapts the column widths', async () => {
    let widthSpy = spyOn(component, 'setWidth');
    component.ngAfterViewInit();
    await fixture.whenStable();
    expect(widthSpy).toHaveBeenCalledTimes(1);
    window.dispatchEvent(new Event('resize'));
    expect(widthSpy).toHaveBeenCalledTimes(2);
  });

  it('updates the capacity bar with checked-in count', async () => {
    let dataSpy = spyOn(component['dataService'], 'mergeItemValue');
    component.passes = [MockData.mockPass_1];
    component.updateCapacityBarCheckIns();
    await fixture.whenStable();
    expect(dataSpy).toHaveBeenCalledWith(
      Constants.dataIds.CURRENT_CAPACITY_BAR_OBJECT, {
      checkInCount: 4
    })
  });

  it('formatsCheckedInTime', async () => {
    expect(component.formatCheckedInTime({...mockPass1})).toEqual('12/18/2022, 11:00 AM');
    expect(component.formatCheckedInTime(null)).toEqual('N/A');
  });

  it('filters pass list by checked-in status', async () => {
    component.passes = [{...MockData.mockPass_1}];
    component.changeCheckInState({ value: 'checkedIn' });
    expect(component.tableRows.length).toEqual(1);
    expect(component.checkedInState).toEqual('checkedIn');
    component.changeCheckInState({ value: 'notCheckedIn' });
    expect(component.tableRows.length).toEqual(0);
    expect(component.checkedInState).toEqual('notCheckedIn');
    component.changeCheckInState({ value: 'all' });
    expect(component.tableRows.length).toEqual(1);
    expect(component.checkedInState).toEqual('all');
    component.changeCheckInState(undefined);
    expect(component.tableRows.length).toEqual(1);
    expect(component.checkedInState).toEqual('all');
  });
});
