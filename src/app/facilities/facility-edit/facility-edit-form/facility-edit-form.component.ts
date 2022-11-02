import { ChangeDetectorRef, Component, Input } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { FormService } from 'src/app/services/form.service';
import { LoadingService } from 'src/app/services/loading.service';
import { PassService } from 'src/app/services/pass.service';
import { BaseFormComponent } from 'src/app/shared/components/ds-forms/base-form/base-form.component';
import { Constants } from 'src/app/shared/utils/constants';

@Component({
  selector: 'app-facility-edit-form',
  templateUrl: './facility-edit-form.component.html',
  styleUrls: ['./facility-edit-form.component.scss'],
})
export class FacilityEditFormComponent extends BaseFormComponent {
  @Input() facility;

  public bookingDaysFormArray;
  public bookingOpeningHourFormGroup;
  public isEditMode = true;
  public newForm;

  constructor(
    protected formBuilder: UntypedFormBuilder,
    protected formService: FormService,
    protected router: Router,
    protected dataService: DataService,
    protected loadingService: LoadingService,
    protected changeDetector: ChangeDetectorRef,
    protected passService: PassService
  ) {
    super(
      formBuilder,
      formService,
      router,
      dataService,
      loadingService,
      changeDetector
    );
    this.subscriptions.add(
      this.dataService
        .watchItem(Constants.dataIds.CURRENT_FACILITY)
        .subscribe((res) => {
          if (res && res[0]) {
            this.facility = res[0];
            this.data = this.facility;
            this.setForm();
          }
        })
    );
    this.setForm();
  }

  add() {
    this.isEditMode = false;
    this.data = {};
    this.form.reset();
    this.changeDetector.detectChanges();
  }

  getMeridiem() {
    // Stored in db as 24h time.
    if (this.facility.bookingOpeningHour && this.facility.bookingOpeningHour >= 12) {
      return 'PM';
    }
    return 'AM';
  }

  convert24HTo12H(hour) {
    if (hour > 12) {
      hour = hour - 12;
    }
    if (hour === 0) {
      hour = 12;
    }
    return hour;
  }

  getFacilityState(state) {
    if (state === 'open') {
      return true;
    }
    return false;
  }

  setForm() {
    // Create base form
    this.form = new UntypedFormGroup({
      facilityStatusControl: new UntypedFormControl({
        value: this.data.status?.state === 'open' ? true : false,
        disabled: super.checkDisable()
      }),
      facilityClosureReasonControl: new UntypedFormControl({
        value: this.data.status?.stateReason == null ? '' : this.data.status?.stateReason,
        disabled: super.checkDisable()
      }),
      facilityVisibilityControl: new UntypedFormControl({
        value: this.data.visible,
      }),
      facilityNameControl: new UntypedFormControl(
        {
          value: this.data.name,
          disabled: super.checkDisable([this.isEditMode])
        },
        Validators.required
      ),
      facilityTypeControl: new UntypedFormControl(
        {
          value: this.data.type,
          disabled: super.checkDisable([this.isEditMode])
        },
        Validators.required
      ),
      facilityBookingOpeningHourControl: new UntypedFormControl({
        value: this.data.bookingOpeningHour,
        disabled: super.checkDisable()
      }),
      facilityBookingDaysAheadControl: new UntypedFormControl({
        value: this.data.bookingDaysAhead,
        disabled: super.checkDisable()
      }),
      facilityBookingDaysRichTextControl: new UntypedFormControl({
        value: this.data.bookingDaysRichText,
        disabled: super.checkDisable()
      }),
      facilityBookingDaysControl: new UntypedFormControl({
        value: this.data.bookingDays,
        disabled: super.checkDisable()
      }),
    });
    this.fields = {
      facilityStatus: this.form.get('facilityStatusControl'),
      facilityVisibility: this.form.get('facilityVisibilityControl'),
      facilityClosureReason: this.form.get('facilityClosureReasonControl'),
      facilityName: this.form.get('facilityNameControl'),
      facilityType: this.form.get('facilityTypeControl'),
      facilityBookingOpeningHour: this.form.get(
        'facilityBookingOpeningHourControl'
      ),
      facilityBookingDaysAhead: this.form.get(
        'facilityBookingDaysAheadControl'
      ),
      facilityBookingDaysRichText: this.form.get(
        'facilityBookingDaysRichTextControl'
      ),
      facilityBookingDays: this.form.get('facilityBookingDaysControl'),
    };

    super.subscribeToChanges();
  }

  async onSubmit() {
    let res = await super.submit();
    console.log('res:', res);
  }
}
