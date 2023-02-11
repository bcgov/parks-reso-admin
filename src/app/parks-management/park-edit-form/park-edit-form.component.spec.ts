import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { DataService } from 'src/app/services/data.service';
import { Constants } from 'src/app/shared/utils/constants';
import { MockData } from 'src/app/shared/utils/mock-data';

import { ParkEditFormComponent } from './park-edit-form.component';

describe('ParkEditFormComponent', () => {
  let component: ParkEditFormComponent;
  let fixture: ComponentFixture<ParkEditFormComponent>;

  let mockPark = MockData.mockPark_1;

  // Have to format the object how the API is expecting it.
  let mockSubmission = {
    park: {
      name: mockPark.name,
      orcs: mockPark.orcs,
      bcParksLink: mockPark.bcParksLink,
      mapLink: mockPark.bcParksLink,
      status: mockPark.status,
      capacity: mockPark.capacity,
    },
    description: mockPark.description,
    visible: mockPark.visible,
  };

  let mockDataService = {
    watchItem: (id) => {
      if (id === Constants.dataIds.CURRENT_PARK) {
        return new BehaviorSubject(mockPark);
      }
      return new BehaviorSubject(null);
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParkEditFormComponent],
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule],
      providers: [
        HttpClient,
        HttpHandler,
        ConfigService,
        BsModalService,
        { provide: DataService, useValue: mockDataService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ParkEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.park).toBeDefined();
  });

  it('submits form for formatting', async () => {
    component.data = mockPark;
    component.setForm();
    const formatResultsSpy = spyOn(
      component,
      'formatFormResults'
    ).and.callThrough();
    const displayModalSpy = spyOn(component, 'displayConfirmationModal');
    await component.onSubmit();
    expect(formatResultsSpy).toHaveBeenCalledTimes(1);
    expect(displayModalSpy).toHaveBeenCalledOnceWith(mockSubmission);
  });

  it('displays park 1 confirmation modal', async () => {
    component.displayConfirmationModal(mockSubmission);
    let message = component.parkEditModal.body;
    let body = document.createElement('div');
    body.innerHTML = message;
    expect(body.innerText).toContain('Status:Open (passes required');
    expect(body.innerText).toContain('Name:Mock Park 1');
    expect(body.innerText).toContain('Visibility:Visible to public');
    expect(body.innerText).toContain(`Link to map:${mockPark.mapLink}`);
    expect(body.innerText).toContain(
      `Link to BC Parks Site:${mockPark.bcParksLink}`
    );
    expect(body.innerText).toContain(`Description:${mockPark.description}`);
    // buttons
    const modalRefSpy = spyOn(component.parkEditModalRef, 'hide');
    const submitChangesSpy = spyOn(
      component,
      'submitParkChanges'
    ).and.callThrough();
    const navBackSpy = spyOn(component, 'navigateBack').and.callThrough();
    const navSpy = spyOn(component['router'], 'navigate');
    const parkServiceSpy = spyOn(component['parkService'], 'putPark');
    const buttons = component.parkEditModal.buttons;
    buttons[0].onClick();
    expect(modalRefSpy).toHaveBeenCalledTimes(1);
    modalRefSpy.calls.reset();
    buttons[1].onClick();
    expect(modalRefSpy).toHaveBeenCalledTimes(1);
    expect(submitChangesSpy).toHaveBeenCalledTimes(1);
    expect(parkServiceSpy).toHaveBeenCalledOnceWith(mockSubmission);
    expect(navBackSpy).toHaveBeenCalledTimes(1);
    expect(navSpy).toHaveBeenCalledTimes(1);
  });

  it('tests the links', async () => {
    let buttons = fixture.debugElement.queryAll(
      By.css('.btn.btn-primary.mb-3')
    );
    const e = new Event('click');
    const eventSpy = spyOn(e, 'preventDefault');
    const windowSpy = spyOn(window, 'open');
    const parkLinkSpy = spyOn(component, 'testParkSiteLink').and.callThrough();
    const mapLinkSpy = spyOn(component, 'testMapLink').and.callThrough();
    // Parks site link
    buttons[0].nativeElement.dispatchEvent(e);
    expect(parkLinkSpy).toHaveBeenCalledTimes(1);
    expect(eventSpy).toHaveBeenCalledTimes(1);
    expect(windowSpy).toHaveBeenCalledTimes(1);
    // Map link
    buttons[1].nativeElement.dispatchEvent(e);
    expect(mapLinkSpy).toHaveBeenCalledTimes(1);
    expect(eventSpy).toHaveBeenCalledTimes(2);
    expect(windowSpy).toHaveBeenCalledTimes(2);
  });

  it('properly builds submission buttons', async () => {
    const submitSpy = spyOn(component, 'onSubmit');
    const resetSpy = spyOn(component, 'setForm');
    const cancelSpy = spyOn(component, 'navigateBack');
    const sectionElement = fixture.debugElement.query(
      By.css('.d-flex.flex-row-reverse')
    );
    const buttons = sectionElement.nativeElement.getElementsByTagName('button');
    // Submit
    buttons[0].click();
    expect(submitSpy).toHaveBeenCalledTimes(1);
    // Reset
    component.form.markAsDirty();
    fixture.detectChanges();
    buttons[1].click();
    expect(resetSpy).toHaveBeenCalledTimes(1);
    // Cancel
    buttons[2].click();
    expect(cancelSpy).toHaveBeenCalledTimes(1);
  });
});
