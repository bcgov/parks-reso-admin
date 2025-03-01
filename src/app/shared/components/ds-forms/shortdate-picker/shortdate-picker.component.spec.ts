import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortdatePickerComponent } from './shortdate-picker.component';

describe('ShortdatePickerComponent', () => {
  let component: ShortdatePickerComponent;
  let fixture: ComponentFixture<ShortdatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ShortdatePickerComponent],
}).compileComponents();

    fixture = TestBed.createComponent(ShortdatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize and clear properly', async () => {
    expect(component).toBeTruthy();
    component.ngOnInit();
    await fixture.isStable();
    fixture.detectChanges();
    expect(component.modelDate).toBeNull();
    component.control.setValue('2022-12-12');
    expect(component.modelDate).toEqual('2022-12-12');
    component.clearDate();
    expect(component.control.value).toBeNull();
    expect(component.modelDate).toBeNull();
  });

  it('changes the date properly', async () => {
    component.ngOnInit();
    await fixture.isStable();
    fixture.detectChanges();
    expect(component.control.pristine).toBeTrue();
    const onDateChangeSpy = spyOn(component, 'onDateChange').and.callThrough();
    const e = new Event('ngModelChange');
    const inputElement =
      fixture.debugElement.nativeElement.getElementsByTagName('input')[0];
    inputElement.dispatchEvent(e);
    expect(onDateChangeSpy).toHaveBeenCalledTimes(1);
    expect(component.control.pristine).toBeFalse();
  });

  it('should check disabled', async () => {
    component.control.disable();
    expect(component.checkDisabled()).toBeTrue();
    component.control.enable();
    expect(component.checkDisabled()).toBeFalse();
  });

  it('unsubscribes when destroyed', async () => {
    // spyOn<any>() tricks ts compiler into viewing private variables
    const spy = spyOn<any>(component['subscriptions'], 'unsubscribe');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
