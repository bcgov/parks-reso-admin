import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { LoadingService } from 'src/app/services/loading.service';

export interface formResult {
  form: UntypedFormGroup; // the form object
  isValid?: boolean; // form validity
  fields?: any; // raw key:value pairs formatted how form is structured (respects nesting)
  invalidControls?: any; // list of invalid controls
  disabledControls?: any; // list of disabled controls
  controlsArray?: any[]; // flattened list of controls
}

@Component({
    selector: 'app-base-form',
    templateUrl: './base-form.component.html',
    styleUrls: ['./base-form.component.scss'],
    standalone: true,
})
export class BaseFormComponent implements OnDestroy, AfterContentInit {
  public form: UntypedFormGroup; // the base form.
  public data: any = {}; // existing form data
  public fields: any = {}; // raw key:value pairs of the form inputs.
  public subscriptions = new Subscription();
  public disabledSubscriptions = new Subscription();
  public loading = false;
  public disabledControls: any = {}; // object of disabled controls
  public isSubmitted = false;

  // Form events that can be listened to:
  // TODO: add more events if necessary
  public resetEvent = new EventEmitter();

  constructor(
    public bFormBuilder: UntypedFormBuilder,
    public bRouter: Router,
    public bDataService: DataService,
    public bLoadingService: LoadingService,
    public bChangeDetector: ChangeDetectorRef
  ) {
    this.form = this.bFormBuilder.group({});
    this.subscriptions.add(
      this.bLoadingService.getLoadingStatus().subscribe((res) => {
        this.loading = res;
        // if enable()/disable() functions arent wrapped in setTimeout(), race conditions can occur
        // https://github.com/angular/angular/issues/22556
        if (this.loading) {
          this.disable();
        } else {
          this.enable();
        }
      })
    );
  }

  ngAfterContentInit() {
    this.bChangeDetector.detectChanges();
  }

  /**
   * Sets up the `fields` object, which is a structured version of the form and its controls.
   * The `fields` object links the name of each form control to the control itself, as the controls do
   * not know what their own instance is named. The field `name` is added to the control to fix this.
   * The object `fields` respects the form control nesting structure while `controls` does not.
   */
  setFields() {
    this.fields = this.getFieldNames(this.form.controls);
  }

  /**
   * Recursively constructs the `fields` object.
   */
  getFieldNames(controls) {
    let list: any = {};
    for (const control of Object.keys(controls)) {
      if (controls[control].hasOwnProperty('controls')) {
        list[control] = this.getFieldNames(controls[control].controls);
      } else {
        list[control] = controls[control];
        list[control].name = control;
      }
    }
    return list;
  }

  /**
   * Adds a specialized disabling rule to a control.
   * @param control - the `FormControl` that will be affected by the rule.
   * @param condition - a function that will disable the control if it evaluates to true.
   * If no condition is provided, the field is permanently disabled.
   * @param subject  - a `BehaviourSubject` whose changes will be subscribed to. When the observable
   * is fired, the condition functions are rechecked to see if the control status will change. If no subject
   * is provided, the control status will only be set once on initialization.
   */
  addDisabledRule(
    control,
    condition?: Function,
    subject?: BehaviorSubject<any>
  ) {
    // if no conditions are provided, permanently disable the field.
    if (!condition) {
      this.setControlStatus(control, true);
    } else {
      // On initial pass through, set the control status based on conditions
      if (condition()) {
        this.setControlStatus(control, true);
      } else {
        this.setControlStatus(control, false);
      }
      // then, if subject is provided, subscribe to changes in the subject for future status changes.
      if (subject) {
        this.disabledSubscriptions.add(
          subject.subscribe(() => {
            if (condition()) {
              this.setControlStatus(control, true);
            } else {
              this.setControlStatus(control, false);
            }
          })
        );
      }
    }
  }

  clearDisabledRules() {
    this.disabledSubscriptions.unsubscribe();
    this.disabledSubscriptions = new Subscription();
  }

  /**
   * Execute a callback when any changes occur in a control.
   * @param callback - a callback `Function` to be executed on control changes.
   */
  subscribeToControlValueChanges(control, callback) {
    this.subscriptions.add(
      control.valueChanges.subscribe((changes) => {
        callback(changes);
      })
    );
  }

  /**
   * Execute a callback when any changes occur in the form.
   * @param callback - a callback `Function` to be executed on form changes.
   */
  subscribeToFormValueChanges(callback) {
    for (const control of this.getControlsArray()) {
      this.subscribeToControlValueChanges(control, callback);
    }
  }

  /**
   * Enables/disables a specific control.
   * @param control - the `FormControl` to enable/disable.
   * @param disable - set `true` to disable, `false` to enable.
   */
  setControlStatus(control, disable: boolean) {
    if (disable) {
      if (!control.disabled) {
        control.disable();
        if (!this.disabledControls.hasOwnProperty(control.name)) {
          this.disabledControls[control.name] = control;
        }
      }
    } else {
      if (!control.enabled) {
        control.enable();
        if (this.disabledControls[control.name]) {
          delete this.disabledControls[control.name];
        }
      }
    }
  }

  /**
   * @returns an array of all controls in the form. Nested controls are flattened.
   */
  getControlsArray() {
    let list: any[] = [];
    return this.getAllControls(this.form.controls, list);
  }

  /**
   * A method that creates an array of every control in the form.
   * Controls that have their own controls attribute are traversed recursively to surface nested controls.
   * @param controls - the root list of controls.
   * @param list - an array of `FormControl` objects.
   * @returns an array of `FormControl` objects.
   */
  // A way to get nested controls via recursion
  getAllControls(controls, list) {
    for (const control of Object.keys(controls)) {
      if (controls[control].hasOwnProperty('controls')) {
        this.getAllControls(controls[control].controls, list);
      } else {
        list.push(controls[control]);
      }
    }
    return list;
  }

  /**
   * Disable the entire form.
   */
  async disable() {
    await setTimeout(() => {
      this.form.disable({emitEvent: false});
    });
  }

  /**
   * Enable the entire form - except for controls that have been specifically disabled with `addDisabledRule()`.
   */
  async enable() {
    await this.disable();
    await setTimeout(() => {
      for (const control of this.getControlsArray()) {
        // check for special disabled rules and evaluate them
        if (this.disabledControls.hasOwnProperty(control.name)) {
          // Control is specifically disabled, prevent reenabling
          continue;
        } else {
          setTimeout(() => {
            control.enable({emitEvent: false});
          });
        }
      }
    });
  }

  /**
   * To be called when all controls have been initialzied, so any changes can be registered
   */
  updateForm() {
    this.setFields();
    this.clearDisabledRules();
  }

  /**
   * Gathers the key:value form data and creates a object representing the current state of form control values.
   * @returns - an Object containing the key:value pairs of the form controls.
   */
  collect() {
    let res: any = {};
    for (const control of Object.keys(this.form.controls)) {
      const value = this.form.controls[control]?.getRawValue();
      res = { ...res, [control]: value };
    }
    return res;
  }

  reset() {
    this.isSubmitted = false;
    this.disabledControls = [];
    this.clearDisabledRules();
    for (const control of this.getControlsArray()) {
      control.reset();
      control.markAsUntouched();
      control.markAsPristine();
      control.updateValueAndValidity();
      control.setErrors(null);
    }
  }

  clear() {
    this.data = {};
    this.reset();
  }

  /**
   * Collects all invalid controls in the form.
   * @returns an array of invalid controls.
   */
  getInvalidControls() {
    let list: any[] = [];
    for (const control of this.getControlsArray()) {
      if (control.invalid) {
        list.push(control);
      }
    }
    return list;
  }

  /**
   * Checks the form for validity.
   * @returns `true` if form is valid, otherwise `false`.
   */
  validate() {
    if (this.form.valid) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * Collects all the data in the form and returns it for post-processing.
   * @returns {formResult} a `formResult` Promise.
   */
  // return current state of form
  async submit() {
    // We want to override loading to be sure everything is disabled.
    this.loading = true;
    // check form validity - do not submit if form is invalid.
    if (this.validate()) {
      // Form is valid
    } else {
      this.loading = false;
      // TODO: handle invalid fields here
    }

    const fResult: formResult = {
      form: this.form,
      fields: this.collect(),
      isValid: this.validate(),
      invalidControls: this.getInvalidControls(),
      disabledControls: this.disabledControls,
      controlsArray: this.getControlsArray(),
    };
    this.isSubmitted = true;
    this.loading = false;
    return fResult;
  }

  ngOnDestroy() {
    this.disabledSubscriptions.unsubscribe();
    this.subscriptions.unsubscribe();
  }
}
