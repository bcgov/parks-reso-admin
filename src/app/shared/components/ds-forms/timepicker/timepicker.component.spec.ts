import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimepickerComponent } from './timepicker.component';

describe('TimepickerComponent', () => {
  let component: TimepickerComponent;
  let fixture: ComponentFixture<TimepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimepickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TimepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize time properly', () => {
    expect(component.control.value).toEqual({ hour: 0, minute: 0, second: 0 });
    component.defaultTime = { hour: 4, minute: 5, second: 6 };
    component.reset = new EventEmitter<any>();
    const resetSpy = spyOn(component, 'clearTime');
    component.ngOnInit();
    expect(component.control.value).toEqual({ hour: 4, minute: 5, second: 6 });
    component.control.setValue({ hour: 1, minute: 2, second: 3 });
    component.ngOnInit();
    expect(component.control.value).toEqual({ hour: 1, minute: 2, second: 3 });
    component.reset.emit();
    expect(resetSpy).toHaveBeenCalled();
  });

  it('should update time properly', () => {
    component.modelTime = new Date('December 9, 2022 11:46:00');
    component.onTimeChange('event');
    expect(component.isInitialLoad).toBeFalsy();
    component.onTimeChange('event');
    expect(component.control.value).toEqual({
      hour: 11,
      minute: 46,
      second: 0,
    });
    component.onTimeChange(null);
    expect(component.control.value).toEqual({ hour: 0, minute: 0, second: 0 });
  });

  it('should clear time properly', () => {
    expect(component.initialTime).toEqual({ hour: 0, minute: 0, second: 0 });
    component.control.setValue({ hour: 1, minute: 2, second: 3 });
    component.clearTime();
    expect(component.control.value).toEqual({ hour: 0, minute: 0, second: 0 });
  });
});
