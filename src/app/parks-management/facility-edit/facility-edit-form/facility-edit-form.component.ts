import { ChangeDetectorRef, Component, Input } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { FacilityService } from 'src/app/services/facility.service';
import { FormService } from 'src/app/services/form.service';
import { LoadingService } from 'src/app/services/loading.service';
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
  public isEditMode = new BehaviorSubject<boolean>(true);
  public facilityBookingDaysArray: any[] = [];
  public parkName;

  constructor(
    protected formBuilder: UntypedFormBuilder,
    protected formService: FormService,
    protected router: Router,
    protected dataService: DataService,
    protected loadingService: LoadingService,
    protected changeDetector: ChangeDetectorRef,
    private facilityService: FacilityService
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
            this.parkName = this.facility.pk.split('::')[1];
            this.setForm();
          } else {
            this.isEditMode.next(false);
          }
        })
    );
    this.setForm();
  }

  getPassesRequired() {
    if (this.data?.bookingDays) {
      for (const day in this.data.bookingDays) {
        if (!this.data.bookingDays[day]) {
          return true;
        }
      }
    }
    return false;
  }

  isFormValid() {
    return super.validate();
  }

  setForm() {
    // Create booking days subform:
    let bookableDaysFormGroup = new UntypedFormGroup({
      Monday: new UntypedFormControl(
        this.data.bookingDays?.['1'] ? true : false
      ),
      Tuesday: new UntypedFormControl(
        this.data.bookingDays?.['2'] ? true : false
      ),
      Wednesday: new UntypedFormControl(
        this.data.bookingDays?.['3'] ? true : false
      ),
      Thursday: new UntypedFormControl(
        this.data.bookingDays?.['4'] ? true : false
      ),
      Friday: new UntypedFormControl(
        this.data.bookingDays?.['5'] ? true : false
      ),
      Saturday: new UntypedFormControl(
        this.data.bookingDays?.['6'] ? true : false
      ),
      Sunday: new UntypedFormControl(
        this.data.bookingDays?.['7'] ? true : false
      ),
    });
    // Create booking time capacities subform
    let bookingTimesFormGroup = new UntypedFormGroup({
      AM: new UntypedFormControl(this.data.bookingTimes?.AM ? true : false),
      PM: new UntypedFormControl(this.data.bookingTimes?.PM ? true : false),
      DAY: new UntypedFormControl(this.data.bookingTimes?.DAY ? true : false),
      capacityAM: new UntypedFormControl(
        this.data.bookingTimes?.AM?.max || null
      ),
      capacityPM: new UntypedFormControl(
        this.data.bookingTimes?.PM?.max || null
      ),
      capacityDAY: new UntypedFormControl(
        this.data.bookingTimes?.DAY?.max || null
      ),
    });
    // Create base form
    this.form = new UntypedFormGroup({
      facilityStatusControl: new UntypedFormControl(
        this.data.status?.state === 'open' ? true : false
      ),
      facilityClosureReasonControl: new UntypedFormControl(
        this.data.status?.stateReason || null
      ),
      facilityVisibilityControl: new UntypedFormControl(this.data.visible),
      facilityNameControl: new UntypedFormControl(
        this.data.name,
        Validators.required
      ),
      facilityTypeControl: new UntypedFormControl(
        this.data.type,
        Validators.required
      ),
      facilityBookingOpeningHourControl: new UntypedFormControl({
        hour: this.data.bookingOpeningHour || 0,
        minute: 0,
        second: 0,
      } as NgbTimeStruct),
      facilityBookingDaysAheadControl: new UntypedFormControl(
        this.data.bookingDaysAhead
      ),
      facilityBookingDaysRichTextControl: new UntypedFormControl(
        this.data.bookingDaysRichText
      ),
      facilityBookingDaysGroup: bookableDaysFormGroup,
      facilityBookingTimesGroup: bookingTimesFormGroup,
      facilityPassesRequiredControl: new UntypedFormControl(
        this.getPassesRequired()
      ),
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
      facilityBookingDays: this.form.get('facilityBookingDaysGroup'),
      facilityBookingTimes: this.form.get('facilityBookingTimesGroup'),
      facilityPassesRequired: this.form.get('facilityPassesRequiredControl'),
    };

    // add special field disabling rules
    super.addDisabledRule(this.fields.facilityName, this.isEditMode, [true]);
    super.addDisabledRule(this.fields.facilityType, this.isEditMode, [true]);
    super.addDisabledRule(
      this.fields.facilityClosureReason,
      this.fields.facilityStatus.valueChanges,
      [true]
    );
    super.addDisabledRule(
      this.fields.facilityBookingTimes.get('capacityAM'),
      this.fields.facilityBookingTimes.controls['AM'].valueChanges,
      [false, null]
    );
    super.addDisabledRule(
      this.fields.facilityBookingTimes.get('capacityPM'),
      this.fields.facilityBookingTimes.controls['PM'].valueChanges,
      [false, null]
    );
    super.addDisabledRule(
      this.fields.facilityBookingTimes.get('capacityDAY'),
      this.fields.facilityBookingTimes.controls['DAY'].valueChanges,
      [false, null]
    );
  }

  async onSubmit() {
    let res = await super.submit();
    if (res.invalidControls.length === 0) {
      const postObj = this.formatFormResults(res.fields);
      if (this.isEditMode.value === true) {
        this.facilityService.putFacility(postObj, this.parkName);
      } else {
        this.facilityService.postFacility(postObj, this.parkName);
      }
    }
  }

  // format form fields for API submission
  formatFormResults(results) {
    // create bookingTimes subObject
    let resultTimes = {};
    if (results.facilityBookingTimesGroup?.AM) {
      resultTimes['AM'] = {
        max: results.facilityBookingTimesGroup.capacityAM,
      };
    }
    if (results.facilityBookingTimesGroup?.PM) {
      resultTimes['PM'] = {
        max: results.facilityBookingTimesGroup.capacityPM,
      };
    }
    if (results.facilityBookingTimesGroup?.DAY) {
      resultTimes['DAY'] = {
        max: results.facilityBookingTimesGroup.capacityDAY,
      };
    }
    // create API submission object
    const postObj = {
      name: results.facilityNameControl,
      status: {
        state: results.facilityStatusControl ? 'open' : 'closed',
        stateReason: results.facilityClosureReasonControl,
      },
      type: results.facilityTypeControl,
      visible: results.facilityVisibilityControl,
      bookingTimes: resultTimes,
      bookingOpeningHour: results.facilityBookingOpeningHourControl?.hour,
      bookingDaysAhead: results.facilityBookingDaysAheadControl,
      bookingDays: {
        1: results.facilityBookingDaysGroup.Monday,
        2: results.facilityBookingDaysGroup.Tuesday,
        3: results.facilityBookingDaysGroup.Wednesday,
        4: results.facilityBookingDaysGroup.Thursday,
        5: results.facilityBookingDaysGroup.Friday,
        6: results.facilityBookingDaysGroup.Saturday,
        7: results.facilityBookingDaysGroup.Sunday,
      },
      bookingDaysRichText: results.facilityBookingDaysRichTextControl,
      bookableHolidays: [],
    };
    return postObj;
  }
}
