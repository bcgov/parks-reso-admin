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
  @Input() park;

  public bookingDaysFormArray;
  public bookingOpeningHourFormGroup;
  public isEditMode = new BehaviorSubject<boolean>(true);
  public facilityBookingDaysArray: any[] = [];

  public defaultBookingDaysRichText =
    '<p>You don&rsquo;t need a day-use pass for this date and pass type. Passes may be required on other days and at other parks.</p>';

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
            this.setForm();
          } else {
            this.isEditMode.next(false);
          }
        })
    );
    this.subscriptions.add(
      dataService.watchItem(Constants.dataIds.CURRENT_PARK).subscribe((res) => {
        if (res && res[0]) {
          this.park = res[0];
        }
      })
    );
    this.intializeForm();
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

  intializeForm() {
    // First pass of form initialization, establish disabledRules (if any)
    this.setForm();

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

  setForm() {
    // Create booking days subform:
    let bookableDaysFormGroup = new UntypedFormGroup({
      Monday: new UntypedFormControl(
        this.data.bookingDays ? this.data.bookingDays['1'] : true
      ),
      Tuesday: new UntypedFormControl(
        this.data.bookingDays ? this.data.bookingDays['2'] : true
      ),
      Wednesday: new UntypedFormControl(
        this.data.bookingDays ? this.data.bookingDays['3'] : true
      ),
      Thursday: new UntypedFormControl(
        this.data.bookingDays ? this.data.bookingDays['4'] : true
      ),
      Friday: new UntypedFormControl(
        this.data.bookingDays ? this.data.bookingDays['5'] : true
      ),
      Saturday: new UntypedFormControl(
        this.data.bookingDays ? this.data.bookingDays['6'] : true
      ),
      Sunday: new UntypedFormControl(
        this.data.bookingDays ? this.data.bookingDays['7'] : true
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
      facilityStatus: new UntypedFormControl(
        this.data.status?.state === 'open' ? true : false
      ),
      facilityClosureReason: new UntypedFormControl(
        this.data.status?.stateReason || null
      ),
      facilityVisibility: new UntypedFormControl(this.data.visible),
      facilityName: new UntypedFormControl(this.data.name, Validators.required),
      facilityType: new UntypedFormControl(this.data.type, Validators.required),
      facilityBookingOpeningHour: new UntypedFormControl({
        hour: this.data.bookingOpeningHour || 7,
        minute: 0,
        second: 0,
      } as NgbTimeStruct),
      facilityBookingDaysAhead: new UntypedFormControl(
        this.data.bookingDaysAhead
      ),
      facilityBookingDaysRichText: new UntypedFormControl(
        this.data
          ? this.data.bookingDaysRichText
          : this.defaultBookingDaysRichText
      ),
      facilityBookingDaysGroup: bookableDaysFormGroup,
      facilityBookingTimesGroup: bookingTimesFormGroup,
      facilityPassesRequired: new UntypedFormControl(this.getPassesRequired()),
    });
    this.fields = {
      facilityStatus: this.form.get('facilityStatus'),
      facilityVisibility: this.form.get('facilityVisibility'),
      facilityClosureReason: this.form.get('facilityClosureReason'),
      facilityName: this.form.get('facilityName'),
      facilityType: this.form.get('facilityType'),
      facilityBookingOpeningHour: this.form.get('facilityBookingOpeningHour'),
      facilityBookingDaysAhead: this.form.get('facilityBookingDaysAhead'),
      facilityBookingDaysRichText: this.form.get('facilityBookingDaysRichText'),
      facilityBookingDays: this.form.get('facilityBookingDaysGroup'),
      facilityBookingTimes: this.form.get('facilityBookingTimesGroup'),
      facilityPassesRequired: this.form.get('facilityPassesRequired'),
    };
  }

  async onSubmit() {
    let res = await super.submit();
    if (res.invalidControls.length === 0) {
      const postObj = this.formatFormResults(res.fields);
      if (this.isEditMode.value === true) {
        this.facilityService.putFacility(postObj, this.park.sk);
      } else {
        this.facilityService.postFacility(postObj, this.park.sk);
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
      name: results.facilityName,
      status: {
        state: results.facilityStatus ? 'open' : 'closed',
        stateReason: results.facilityClosureReason,
      },
      type: results.facilityType,
      visible: results.facilityVisibility,
      bookingTimes: resultTimes,
      bookingOpeningHour: results.facilityBookingOpeningHour?.hour,
      bookingDaysAhead: results.facilityBookingDaysAhead,
      bookingDays: {
        1: results.facilityBookingDaysGroup.Monday,
        2: results.facilityBookingDaysGroup.Tuesday,
        3: results.facilityBookingDaysGroup.Wednesday,
        4: results.facilityBookingDaysGroup.Thursday,
        5: results.facilityBookingDaysGroup.Friday,
        6: results.facilityBookingDaysGroup.Saturday,
        7: results.facilityBookingDaysGroup.Sunday,
      },
      bookingDaysRichText: results.facilityBookingDaysRichText || '',
      bookableHolidays: [],
    };
    return postObj;
  }
}
