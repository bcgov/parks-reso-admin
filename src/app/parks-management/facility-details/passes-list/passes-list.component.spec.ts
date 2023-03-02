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
    const row = component.tableSchema.columns;
    expect(row.length).toEqual(7);
    // check row values;
    expect(row[0].mapValue(mockPass1)).toEqual('1234567890');
    expect(row[1].mapValue(mockPass1)).toEqual('mock@email.ca');
    expect(row[2].mapValue(mockPass1)).toEqual(4);
    expect(row[3].mapValue(mockPass1)).toEqual('2022-12-18');
    expect(row[4].mapValue(mockPass1)).toEqual('expired');
    expect(row[5].mapValue(mockPass1)).toBeNull();
    expect(row[6].mapValue(mockPass1)).toBeNull();
    expect(row[6].cellTemplate(mockPass1)).toBeDefined();
  });

  it('displays modals when clicked', async () => {
    // Information modal
    const modalServiceSpy = spyOn(
      component['modalService'],
      'show'
    ).and.callThrough();
    const passModalConstructorSpy = spyOn(component, 'constructPassModalBody');
    const passModalSpy = spyOn(component, 'displayPassModal').and.callThrough();
    const passModalFn = component.tableSchema.rowClick(mockPass1);
    passModalFn();
    expect(passModalSpy).toHaveBeenCalledTimes(1);
    expect(modalServiceSpy).toHaveBeenCalledTimes(1);
    expect(component.passModalRef).toBeDefined();
    expect(passModalConstructorSpy).toHaveBeenCalledTimes(1);
    // Cancellation Modal
    modalServiceSpy.calls.reset();
    const cancelModalSpy = spyOn(
      component,
      'displayCancelModal'
    ).and.callThrough();
    const cancelModalConstructorSpy = spyOn(
      component,
      'constructCancelPassModal'
    );
    const cancelModalTemplate =
      component.tableSchema.columns[6].cellTemplate(mockPass1);
    cancelModalTemplate.inputs.onClick();
    expect(cancelModalSpy).toHaveBeenCalledTimes(1);
    expect(component.cancelModalRef).toBeDefined();
    expect(modalServiceSpy).toHaveBeenCalledTimes(1);
    expect(cancelModalConstructorSpy).toHaveBeenCalledTimes(1);
  });

  it('creates pass modal', async () => {
    // Overkill to check every field as the biz req's change often.
    // Check conditional fields & modal functionality instead.
    component.displayPassModal(mockPass1);
    const message = component.passModal.body;
    let body = document.createElement('div');
    body.innerHTML = message;
    expect(body.innerText).not.toContain('Phone Number');
    expect(body.innerText).not.toContain('License Plate');
    const modalHideSpy = spyOn(component.passModalRef, 'hide');
    component.passModal.buttons[0].onClick();
    expect(modalHideSpy).toHaveBeenCalledTimes(1);
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
});
