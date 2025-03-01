import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassAccordionComponent } from './pass-accordion.component';

describe('PassAccordionComponent', () => {
  let component: PassAccordionComponent;
  let fixture: ComponentFixture<PassAccordionComponent>;

  let mockRowSchema = [
    {
      id: 'passId',
      dropdown: 0,
      key: 'registrationNumber' // value of pass object associated with column
    },
    {
      id: 'numberOfGuests',
      dropdown: 4,
      key: 'numberOfGuests'
    },
    {
      id: 'date',
      dropdown: 0,
      key: 'shortPassDate'
    },
    {
      id: 'email',
      dropdown: 3,
      key: 'email'
    },
    {
      id: 'name',
      dropdown: 5,
      key: 'lastName',
    },
    {
      id: 'status',
      dropdown: 2,
      key: 'passStatus',
    },
    {
      id: 'checkedIn',
      dropdown: 2,
      key: 'checkedIn',
    },
    {
      id: 'isOverbooked',
      dropdown: 3,
      key: 'isOverbooked',
    },
    {
      id: 'park',
      dropdown: 7,
      key: 'parkName',
    },
    {
      id: 'facility',
      dropdown: 7,
      key: 'facilityName',
    },
    {
      id: 'passType',
      dropdown: 7,
      key: 'type',
    },
    {
      id: 'checkInTime',
      dropdown: 7,
      key: 'checkedInTime',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PassAccordionComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(PassAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('returns current screen size', async() => {
    // breakpoints have added buffer to ensure breakage before actually breakpoint is reached
    let widthSpy = spyOnProperty(window, 'innerWidth').and.returnValue(360); //mobile
    expect(component.getCurrentScreenSize()).toEqual(0);
    widthSpy.and.returnValue(600);
    expect(component.getCurrentScreenSize()).toEqual(1);
    widthSpy.and.returnValue(800);
    expect(component.getCurrentScreenSize()).toEqual(2);
    widthSpy.and.returnValue(850);
    expect(component.getCurrentScreenSize()).toEqual(3);
    widthSpy.and.returnValue(1050);
    expect(component.getCurrentScreenSize()).toEqual(4);
    widthSpy.and.returnValue(1300);
    expect(component.getCurrentScreenSize()).toEqual(5);
    widthSpy.and.returnValue(1500);
    expect(component.getCurrentScreenSize()).toEqual(6);
  });

  it('sets accordion header and dropdown columns based on screensize', async() => {
    component.rowSchema = mockRowSchema;
    // header + dropdown column count should always be 12
    let widthSpy = spyOn(component, 'getCurrentScreenSize').and.returnValue(0);
    expect(component.getHeaderColumns().length).toEqual(2);
    expect(component.getDropdownColumns().length).toEqual(10);
    widthSpy.and.returnValue(6);
    expect(component.getHeaderColumns().length).toEqual(8);
    expect(component.getDropdownColumns().length).toEqual(4);
  });
});
