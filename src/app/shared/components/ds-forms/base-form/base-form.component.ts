import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { FormService } from 'src/app/services/form.service';
import { LoadingService } from 'src/app/services/loading.service';

export interface formResult {
  form: UntypedFormGroup;
  isValid?: boolean;
  fields?: any; // raw key:value pairs
  invalidFields?: any;
}

@Component({
  selector: 'app-base-form',
  templateUrl: './base-form.component.html',
  styleUrls: ['./base-form.component.scss'],
})
export class BaseFormComponent implements AfterViewChecked, OnDestroy {
  public form: UntypedFormGroup; // the base form.
  public data: any = {}; // existing form data
  public fields: any = {}; // object linking API fields to form controls & values
  public subscriptions = new Subscription();
  public loading = false;

  constructor(
    public bFormBuilder: UntypedFormBuilder,
    public bFormService: FormService,
    public bRouter: Router,
    public bDataService: DataService,
    public bLoadingService: LoadingService,
    public bChangeDetector: ChangeDetectorRef
  ) {
    this.form = this.bFormBuilder.group({});
    this.subscriptions.add(
      this.bLoadingService.getLoadingStatus().subscribe((res) => {
        this.loading = res;
        // if enable()/disable() arent wrapped in setTimeout(), race conditions can occur
        // https://github.com/angular/angular/issues/22556
        if (this.loading) {
          setTimeout(() => {
            this.disable();
          });
        } else {
          setTimeout(() => {
            this.enable();
          });
        }
      })
    );
  }

  ngAfterViewChecked() {
    this.bChangeDetector.detectChanges();
  }

  // subscribe to changes in the form - pass a callback in if necessary.
  subscribeToChanges(callback?) {
    this.subscriptions.add(
      this.form.valueChanges.subscribe((changes) => {
        if (callback) {
          callback(changes);
        }
      })
    );
  }

  // disable the form
  disable() {
    this.form.disable();
  }

  // enable the form - except for fields that are themselves disabled
  enable() {
    this.form.enable();
    // for (const control of Object.keys(this.form.controls)) {
    //   if (this.form.controls[control].disabled) {
    //     console.log(control, 'disabled');
    //   } else {
    //     this.form.controls[control].enable();
    //   }
    // }
  }

  checkDisable(conditions = [false]) {
    for (const condition of conditions) {
      if (condition) {
        return true;
      }
    }
    return false;
  }

  // gather the simplified key:value form data and format for submission
  collect() {
    let res: any = {};
    for (const field of Object.keys(this.fields)) {
      const value = this.fields[field]?.value;
      res = { ...res, [field]: value };
    }
    return res;
  }

  // returns form fields that are currently invalid
  getInvalidFields() {
    let res: any = {};
    for (const control of Object.keys(this.form.controls)) {
      let c = this.form.get(control);
      if (c && !c?.valid) {
        res = { ...res, [control]: c };
      }
    }
    return res;
  }

  // clear the form of all data.
  clear() {
    this.form.reset();
  }

  // check form validity
  validate() {
    if (this.form.valid) {
      return true;
    } else {
      return false;
    }
  }

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
      invalidFields: this.getInvalidFields(),
    };
    this.loading = false;
    return fResult;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
