import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { DataService } from 'src/app/services/data.service';
import { Constants } from 'src/app/shared/utils/constants';
import { MockData } from 'src/app/shared/utils/mock-data';

import { FacilityEditFormComponent } from './facility-edit-form.component';
import { ParkService } from 'src/app/services/park.service';
import { FacilityService } from 'src/app/services/facility.service';

describe('FacilityEditFormComponent', () => {
  let component: FacilityEditFormComponent;
  let fixture: ComponentFixture<FacilityEditFormComponent>;

  let mockFacility1 = MockData.mockFacility_1;
  let mockFacility1Key = { pk: mockFacility1.pk, sk: mockFacility1.sk };
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
      if (key.pk === mockFacility1Key.pk && key.sk === mockFacility1Key.sk) {
        return mockFacility1;
      }
      return null;
    },
    postFacility: (facility) => {
      return null;
    },
    putFacility: (facility) => {
      return null;
    }
  }

  let mockDataService = {
    watchItem: (id) => {
      if (id === Constants.dataIds.CURRENT_FACILITY_KEY) {
        return new BehaviorSubject([mockFacility1]);
      }
      if (id === Constants.dataIds.CURRENT_PARK_KEY) {
        return new BehaviorSubject([mockPark]);
      }
      return null;
    },
  };

  let mockConfigService = {
    config: {
      ADVANCE_BOOKING_HOUR: 7,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [FormsModule, ReactiveFormsModule, RouterTestingModule, FacilityEditFormComponent],
    providers: [
        HttpClient,
        HttpHandler,
        { provide: ConfigService, useValue: mockConfigService },
        BsModalService,
        { provide: DataService, useValue: mockDataService },
        { provide: ParkService, useValue: mockParkService },
        { provide: FacilityService, useValue: mockFacilityService },
    ],
}).compileComponents();

    fixture = TestBed.createComponent(FacilityEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.facility).toBeDefined();
    expect(component.park).toBeDefined();
  });

  it('submits form for formatting', async () => {
    component.data = mockFacility1;
    component.setForm();
    const formatFormResultsSpy = spyOn(
      component,
      'formatFormResults'
    ).and.callThrough();
    const displayModalSpy = spyOn(component, 'displayConfirmationModal');
    let mockSubmission = { ...MockData.mockFacility_1 };
    delete mockSubmission.pk;
    delete mockSubmission.sk;
    delete mockSubmission.isUpdating;
    await component.onSubmit();
    expect(formatFormResultsSpy).toHaveBeenCalledTimes(1);
    expect(displayModalSpy).toHaveBeenCalledOnceWith(mockSubmission);
  });

  it('displays facility 1 confirmation modal', async () => {
    component.displayConfirmationModal(mockFacility1);
    let message = component.facilityEditModal.body;
    let body = document.createElement('div');
    body.innerHTML = message;
    expect(body.innerText).toContain('Open (passes required)');
    expect(body.innerText).toContain('Name:Mock Facility 1');
    expect(body.innerText).toContain('Facility is visible to public');
    expect(body.innerText).toContain('7:00 AM PST/PDT');
    expect(body.innerText).toContain('Booking Days Ahead:2');
    expect(body.innerText).toContain('AM Capacity:5');
    expect(body.innerText).toContain('Thursday, Friday, Saturday, Sunday');
    // buttons
    const modalRefSpy = spyOn(component.facilityEditModalRef, 'hide');
    const submitChangesSpy = spyOn(component, 'submitFacilityChanges');
    const buttons = component.facilityEditModal.buttons;
    buttons[0].onClick();
    expect(modalRefSpy).toHaveBeenCalledTimes(1);
    modalRefSpy.calls.reset();
    buttons[1].onClick();
    expect(modalRefSpy).toHaveBeenCalledTimes(1);
    expect(submitChangesSpy).toHaveBeenCalledTimes(1);
  });

  it('resets the form', async () => {
    const setFormSpy = spyOn(component, 'setForm');
    component.onFormReset();
    expect(setFormSpy).toHaveBeenCalled();
  });

  it('submits formatted facility 1 to facilityService', async () => {
    component.park = mockPark;
    const putSpy = spyOn(component['facilityService'], 'putFacility');
    const postSpy = spyOn(component['facilityService'], 'postFacility');
    component.submitFacilityChanges(mockFacility1);
    expect(postSpy).not.toHaveBeenCalled();
    expect(putSpy).toHaveBeenCalledTimes(1);
  });
});

describe('FacilityAddFormComponent', () => {
  let component: FacilityEditFormComponent;
  let fixture: ComponentFixture<FacilityEditFormComponent>;

  let mockFacility2 = MockData.mockFacility_2;
  let mockFacility2Key = { pk: mockFacility2.pk, sk: mockFacility2.sk };
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
      if (key.pk === mockFacility2Key.pk && key.sk === mockFacility2Key.sk) {
        return mockFacility2;
      }
      return null;
    },
    postFacility: (facility) => {
      return null;
    },
    putFacility: (facility) => {
      return null;
    }
  }

  let mockDataService = {
    watchItem: (id) => {
      if (id === Constants.dataIds.CURRENT_PARK_KEY) {
        return new BehaviorSubject([mockPark]);
      }
      return new BehaviorSubject(false);
    },
  };

  let mockConfigService = {
    config: {
      ADVANCE_BOOKING_HOUR: 7,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [FormsModule, ReactiveFormsModule, RouterTestingModule, FacilityEditFormComponent],
    providers: [
        HttpClient,
        HttpHandler,
        { provide: ConfigService, useValue: mockConfigService },
        BsModalService,
        { provide: DataService, useValue: mockDataService },
        { provide: ParkService, useValue: mockParkService },
        { provide: FacilityService, useValue: mockFacilityService },
    ],
}).compileComponents();

    fixture = TestBed.createComponent(FacilityEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.facility).not.toBeDefined();
    expect(component.park).toBeDefined();
  });

  it('displays facility 2 confirmation modal', async () => {
    component.displayConfirmationModal(mockFacility2);
    let message = component.facilityEditModal.body;
    let body = document.createElement('div');
    body.innerHTML = message;
    expect(body.innerText).toContain('Closed (passes not required)');
    expect(body.innerText).toContain('Name:Mock Facility 2');
    expect(body.innerText).toContain('Facility is not visible to public');
    expect(body.innerText).toContain('7:00 AM PST/PDT (default)');
    expect(body.innerText).toContain('Booking Days Ahead:Same day');
    expect(body.innerText).toContain('All-day Capacity:7');
  });

  it('submits formatted facility 2 to facilityService', async () => {
    component.park = mockPark;
    const putSpy = spyOn(component['facilityService'], 'putFacility');
    const postSpy = spyOn(component['facilityService'], 'postFacility');
    component.submitFacilityChanges(mockFacility2);
    expect(postSpy).toHaveBeenCalledTimes(1);
    expect(putSpy).not.toHaveBeenCalled();
  });
});
