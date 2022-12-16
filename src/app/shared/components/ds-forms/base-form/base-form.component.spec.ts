import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';

import { BaseFormComponent } from './base-form.component';
import { BaseFormModule } from './base-form.module';

describe('BaseFormComponent', () => {
  let comp: BaseFormComponent;
  let fixture: ComponentFixture<BaseFormComponent>;

  let testForm = new UntypedFormGroup({
    testControl1: new UntypedFormControl(),
    testControl2: new UntypedFormControl(),
    testNestedGroup: new UntypedFormGroup({
      testNestedControl1: new UntypedFormControl(),
      testNestedControl2: new UntypedFormControl(),
    }),
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseFormComponent],
      imports: [BaseFormModule, RouterTestingModule],
      providers: [HttpClient, HttpHandler, ConfigService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseFormComponent);
    comp = fixture.componentInstance;
    comp.form = testForm;
    comp.form.reset();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('collects the fields in the form', async () => {
    const fieldSpy = spyOn(comp, 'getFieldNames').and.callThrough();
    comp.setFields();
    // Should be called recursively to get nested fields
    expect(fieldSpy).toHaveBeenCalledTimes(2);
    expect(Object.keys(comp.fields)).toEqual([
      'testControl1',
      'testControl2',
      'testNestedGroup',
    ]);
    expect(Object.keys(comp.fields['testNestedGroup'])).toEqual([
      'testNestedControl1',
      'testNestedControl2',
    ]);
  });

  it('tracks disabled field rules', async () => {
    let testSubject = new BehaviorSubject<boolean>(false);
    const ruleAddSpy = spyOn(
      comp.disabledSubscriptions,
      'add'
    ).and.callThrough();
    const setControlSpy = spyOn(comp, 'setControlStatus');
    const ruleClearSpy = spyOn(comp.disabledSubscriptions, 'unsubscribe');
    comp.addDisabledRule(comp.form.controls['testControl1'], testSubject, [
      true,
    ]);
    await fixture.isStable();
    expect(ruleAddSpy).toHaveBeenCalledTimes(1);
    expect(setControlSpy).toHaveBeenCalledOnceWith(
      comp.form.controls['testControl1'],
      false
    );
    setControlSpy.calls.reset();
    testSubject.next(true);
    await fixture.isStable();
    expect(setControlSpy).toHaveBeenCalledOnceWith(
      comp.form.controls['testControl1'],
      true
    );
    comp.clearDisabledRules();
    expect(ruleClearSpy).toHaveBeenCalledTimes(1);
  });

  it('subscribes to control value changes and form value changes', async () => {
    let callback = {
      func: () => {},
    };
    const callbackSpy = spyOn(callback, 'func');
    const subscriptionSpy = spyOn(comp.subscriptions, 'add');
    comp.subscribeToControlValueChanges(
      comp.form.controls['testControl1'],
      callback.func
    );
    expect(subscriptionSpy).toHaveBeenCalledTimes(1);
    comp.form.controls['testControl1'].setValue('newValue');
    expect(callbackSpy).toHaveBeenCalledTimes(1);
    subscriptionSpy.calls.reset();
    comp.subscribeToFormValueChanges(callback.func);
    // One listener per control in the form (4)
    // (testNestedGroup is not a FormControl)
    expect(subscriptionSpy).toHaveBeenCalledTimes(4);
  });

  it('sets the control status', async () => {
    comp.form.controls['testControl1'].enable();
    comp.disabledControls = [];
    const disableSpy = spyOn(
      comp.form.controls['testControl1'],
      'disable'
    ).and.callThrough();
    const enableSpy = spyOn(
      comp.form.controls['testControl1'],
      'enable'
    ).and.callThrough();
    // disable
    comp.setControlStatus(comp.form.controls['testControl1'], true);
    expect(disableSpy).toHaveBeenCalledTimes(1);
    expect(comp.form.controls['testControl1'].disabled).toBeTrue();
    expect(Object.keys(comp.disabledControls).length).toEqual(1);
    // enable
    comp.setControlStatus(comp.form.controls['testControl1'], false);
    expect(enableSpy).toHaveBeenCalledTimes(1);
    expect(comp.form.controls['testControl1'].enabled).toBeTrue();
    expect(Object.keys(comp.disabledControls).length).toEqual(0);
    spyOn(comp.bLoadingService, 'getLoadingStatus').and.returnValue(of(true));
    // loading disable
    const loadingSpy = spyOn(comp, 'disable');
    comp.bLoadingService.loading.next(true);
    await fixture.isStable();
    expect(loadingSpy).toHaveBeenCalled();
  });

  it('gets a non-nested list of form controls', async () => {
    const getControlsSpy = spyOn(comp, 'getAllControls').and.callThrough();
    expect(comp.getControlsArray().length).toEqual(4);
    // Called twice because of recursion
    expect(getControlsSpy).toHaveBeenCalledTimes(2);
  });

  it('should ignore disabled fields from global re-enable', async () => {
    comp.disabledControls = [];
    comp.setControlStatus(comp.form.controls['testControl1'], true);
    await comp.enable();
    await fixture.isStable();
    expect(Object.keys(comp.disabledControls).length).toEqual(1);
  });

  it('clears data from the form', async () => {
    const array = comp.getControlsArray();
    let spyList = [];
    for (const item of array) {
      spyList.push(spyOn(item, 'reset'));
    }
    comp.clear();
    for (const spy of spyList) {
      expect(spy).toHaveBeenCalled();
    }
    for (const control of array) {
      expect(control.pristine).toBeTrue();
      expect(control.touched).toBeFalse();
      expect(control.errors).toBeNull();
    }
  });

  it('submits the form', async () => {
    const expectedFields = {
      testControl1: null,
      testControl2: null,
      testNestedGroup: {
        testNestedControl1: null,
        testNestedControl2: null,
      },
    };
    comp.form.controls['testControl1'].setErrors({ invalid: true });
    const invalidRes = await comp.submit();
    expect(invalidRes.form).toEqual(comp.form);
    expect(invalidRes.fields).toEqual(expectedFields);
    expect(invalidRes.isValid).toBeFalse();
    expect(invalidRes.invalidControls.length).toEqual(1);
    expect(invalidRes.disabledControls).toEqual({});
    expect(invalidRes.controlsArray.length).toEqual(4);
    expect(comp.isSubmitted).toBeTrue();
    comp.clear();
    const validRes = await comp.submit();
    expect(validRes.isValid).toBeTrue();
    expect(validRes.invalidControls.length).toEqual(0);
  });

  it('unsubscribes on destroy', async () => {
    const sub1Spy = spyOn(comp.subscriptions, 'unsubscribe');
    const sub2Spy = spyOn(comp.disabledSubscriptions, 'unsubscribe');
    comp.ngOnDestroy();
    expect(sub1Spy).toHaveBeenCalled();
    expect(sub2Spy).toHaveBeenCalled();
  });
});
