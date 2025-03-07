import {
  ChangeDetectorRef,
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { DataService } from 'src/app/services/data.service';
import { FacilityService } from 'src/app/services/facility.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ParkService } from 'src/app/services/park.service';
import { BaseFormComponent } from 'src/app/shared/components/ds-forms/base-form/base-form.component';
import { modalSchema } from 'src/app/shared/components/modal/modal.component';
import { Constants } from 'src/app/shared/utils/constants';
import { Utils } from 'src/app/shared/utils/utils';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { FacilityEditFormPassRequirementsComponent } from './facility-edit-form-pass-requirements/facility-edit-form-pass-requirements.component';
import { FacilityEditFormDetailsComponent } from './facility-edit-form-details/facility-edit-form-details.component';
import { FacilityEditFormPublishingDetailsComponent } from './facility-edit-form-publishing-details/facility-edit-form-publishing-details.component';

@Component({
    selector: 'app-facility-edit-form',
    templateUrl: './facility-edit-form.component.html',
    styleUrls: ['./facility-edit-form.component.scss'],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        FacilityEditFormPublishingDetailsComponent,
        FacilityEditFormDetailsComponent,
        FacilityEditFormPassRequirementsComponent,
        ModalComponent,
    ]
})
export class FacilityEditFormComponent extends BaseFormComponent {
  public facility;
  public park;
  public bookingDaysFormArray;
  public bookingOpeningHourFormGroup;
  public facilityEditModal: modalSchema;
  public facilityEditModalRef: BsModalRef;
  public isEditMode = new BehaviorSubject<boolean>(true);
  public facilityBookingDaysArray: any[] = [];
  public defaultBookingDaysRichText =
    '<p>You don&rsquo;t need a day-use pass for this date and pass type. Passes may be required on other days and at other parks.</p>';
  private utils = new Utils();

  @ViewChild('facilityEditConfirmationTemplate')
  facilityEditConfirmationTemplate: TemplateRef<any>;

  constructor(
    protected formBuilder: UntypedFormBuilder,
    protected router: Router,
    protected dataService: DataService,
    protected loadingService: LoadingService,
    protected changeDetector: ChangeDetectorRef,
    private facilityService: FacilityService,
    private parkService: ParkService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private configService: ConfigService
  ) {
    super(formBuilder, router, dataService, loadingService, changeDetector);
    this.subscriptions.add(
      this.dataService
        .watchItem(Constants.dataIds.CURRENT_FACILITY_KEY)
        .subscribe((res) => {
          if (res) {
            this.facility = this.facilityService.getCachedFacility(res);
            this.data = this.facility;
            this.setForm();
          } else {
            this.isEditMode.next(false);
          }
        })
    );
    this.subscriptions.add(
      dataService.watchItem(Constants.dataIds.CURRENT_PARK_KEY).subscribe((res) => {
        if (res) {
          this.park = this.parkService.getCachedPark(res);
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
        this.data?.bookingDays ? this.data?.bookingDays['1'] : true
      ),
      Tuesday: new UntypedFormControl(
        this.data?.bookingDays ? this.data?.bookingDays['2'] : true
      ),
      Wednesday: new UntypedFormControl(
        this.data?.bookingDays ? this.data?.bookingDays['3'] : true
      ),
      Thursday: new UntypedFormControl(
        this.data?.bookingDays ? this.data?.bookingDays['4'] : true
      ),
      Friday: new UntypedFormControl(
        this.data?.bookingDays ? this.data?.bookingDays['5'] : true
      ),
      Saturday: new UntypedFormControl(
        this.data?.bookingDays ? this.data?.bookingDays['6'] : true
      ),
      Sunday: new UntypedFormControl(
        this.data?.bookingDays ? this.data?.bookingDays['7'] : true
      ),
    });
    // Create booking time capacities subform
    let bookingTimesFormGroup = new UntypedFormGroup({
      AM: new UntypedFormControl(this.data?.bookingTimes?.AM ? true : false),
      PM: new UntypedFormControl(this.data?.bookingTimes?.PM ? true : false),
      DAY: new UntypedFormControl(this.data?.bookingTimes?.DAY ? true : false),
      capacityAM: new UntypedFormControl(
        this.data?.bookingTimes?.AM?.max || null
      ),
      capacityPM: new UntypedFormControl(
        this.data?.bookingTimes?.PM?.max || null
      ),
      capacityDAY: new UntypedFormControl(
        this.data?.bookingTimes?.DAY?.max || null
      ),
    });
    // Create base form
    this.form = new UntypedFormGroup({
      facilityStatus: new UntypedFormControl(
        this.data?.status?.state === 'open' ? true : false
      ),
      facilityClosureReason: new UntypedFormControl(
        this.data?.status?.stateReason || null
      ),
      facilityVisibility: new UntypedFormControl(
        this.data?.visible ? this.data?.visible : false
      ),
      facilityQRCode: new UntypedFormControl(
        this.data?.qrcode ? this.data?.qrcode : false
      ),
      facilityName: new UntypedFormControl(this.data?.name, Validators.required),
      facilityType: new UntypedFormControl(this.data?.type, Validators.required),
      facilityBookingOpeningHour: new UntypedFormControl({
        hour: this.data?.bookingOpeningHour || 7,
        minute: 0,
        second: 0,
      } as NgbTimeStruct),
      facilityBookingDaysAhead: new UntypedFormControl(
        this.data?.bookingDaysAhead
      ),
      facilityBookingDaysRichText: new UntypedFormControl(
        this.data
          ? this.data?.bookingDaysRichText
          : this.defaultBookingDaysRichText
      ),
      facilityBookingDays: bookableDaysFormGroup,
      facilityBookingTimes: bookingTimesFormGroup,
      facilityPassesRequired: new UntypedFormControl(this.getPassesRequired()),
    });
    super.updateForm();
    // add special field disabling rules
    super.addDisabledRule(this.fields.facilityName, () => {
      return this.isEditMode.value;
    });
    super.addDisabledRule(this.fields.facilityType, () => {
      return this.isEditMode.value;
    });
    super.addDisabledRule(
      this.fields.facilityClosureReason,
      () => {
        return this.fields.facilityStatus.value;
      },
      this.fields.facilityStatus.valueChanges
    );
    super.addDisabledRule(
      this.fields.facilityBookingTimes.capacityAM,
      () => {
        return !this.fields.facilityBookingTimes.AM.value;
      },
      this.fields.facilityBookingTimes.AM.valueChanges
    );
    super.addDisabledRule(
      this.fields.facilityBookingTimes.capacityPM,
      () => {
        return !this.fields.facilityBookingTimes.PM.value;
      },
      this.fields.facilityBookingTimes.PM.valueChanges
    );
    super.addDisabledRule(
      this.fields.facilityBookingTimes.capacityDAY,
      () => {
        return !this.fields.facilityBookingTimes.DAY.value;
      },
      this.fields.facilityBookingTimes.DAY.valueChanges
    );
  }

  async onSubmit() {
    let res = await super.submit();
    if (res.invalidControls.length === 0) {
      const postObj = this.formatFormResults(res.fields);
      this.displayConfirmationModal(postObj);
    }
  }

  onFormReset() {
    super.reset();
    this.setForm();
    this.resetEvent.emit();
  }

  submitFacilityChanges(facilityObj) {
    if (this.isEditMode.value === true) {
      this.facilityService.putFacility(facilityObj, this.park.sk, true, true);
    } else {
      this.facilityService.postFacility(facilityObj, this.park.sk, true);
    }
    this.navigateBack();
  }

  // format form fields for API submission
  formatFormResults(results) {
    // create bookingTimes subObject
    let resultTimes = {};
    if (
      results.facilityBookingTimes?.AM &&
      results.facilityBookingTimes?.capacityAM
    ) {
      resultTimes['AM'] = {
        max: parseInt(results.facilityBookingTimes.capacityAM, 10),
      };
    }
    if (
      results.facilityBookingTimes?.PM &&
      results.facilityBookingTimes?.capacityPM
    ) {
      resultTimes['PM'] = {
        max: parseInt(results.facilityBookingTimes.capacityPM, 10),
      };
    }
    if (
      results.facilityBookingTimes?.DAY &&
      results.facilityBookingTimes?.capacityDAY
    ) {
      resultTimes['DAY'] = {
        max: parseInt(results.facilityBookingTimes.capacityDAY, 10),
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
      qrcode: results.facilityQRCode,
      bookingTimes: resultTimes,
      bookingOpeningHour: results.facilityBookingOpeningHour?.hour,
      bookingDaysAhead: results.facilityBookingDaysAhead,
      bookingDays: {
        1: results.facilityBookingDays.Monday,
        2: results.facilityBookingDays.Tuesday,
        3: results.facilityBookingDays.Wednesday,
        4: results.facilityBookingDays.Thursday,
        5: results.facilityBookingDays.Friday,
        6: results.facilityBookingDays.Saturday,
        7: results.facilityBookingDays.Sunday,
      },
      bookingDaysRichText: results.facilityBookingDaysRichText || '',
      bookableHolidays: [],
    };
    return postObj;
  }

  displayConfirmationModal(facilityObj) {
    const self = this;
    this.facilityEditModal = {
      id: 'facilityEditModal',
      title: 'Confirm Facility Details:',
      body: this.constructFacilityEditModalBody(facilityObj),
      buttons: [
        {
          text: 'Cancel',
          classes: 'btn btn-outline-secondary',
          onClick: function () {
            self.facilityEditModalRef.hide();
          },
        },
        {
          text: 'Confirm',
          classes: 'btn btn-primary',
          onClick: function () {
            self.submitFacilityChanges(facilityObj);
            self.facilityEditModalRef.hide();
          },
        },
      ],
    };
    this.facilityEditModalRef = this.modalService.show(
      this.facilityEditConfirmationTemplate,
      {
        class: 'modal-lg',
      }
    );
  }

  constructFacilityEditModalBody(facilityObj) {
    let statusMsg = '';
    if (facilityObj.status?.state === 'open') {
      statusMsg += `Open (passes required)`;
    } else {
      statusMsg += `Closed (passes not required)`;
      statusMsg += `</br></br><strong>Closure Reason:</strong></br>`;
      if (facilityObj.status?.stateReason) {
        statusMsg += facilityObj.status?.stateReason;
      } else {
        statusMsg += `None specified`;
      }
    }
    let message = this.utils.buildInnerHTMLRow([
      `<strong>Name:</strong></br>` + facilityObj.name,
      `<strong>Status:</strong></br>` + statusMsg,
    ]);

    let visibleMsg = '';
    if (facilityObj.visible) {
      visibleMsg += `Facility is visible to public`;
    } else {
      visibleMsg += `Facility is not visible to public`;
    }
    message += this.utils.buildInnerHTMLRow([
      `<strong>Visible:</strong></br>` + visibleMsg,
      `<strong>Type:</strong></br>` + facilityObj.type,
    ]);

    let openingHourMsg = '';
    if (facilityObj.bookingOpeningHour) {
      const hour = this.utils.convert24hTo12hTime(
        facilityObj.bookingOpeningHour
      ).hour;
      const meridian = this.utils.convert24hTo12hTime(
        facilityObj.bookingOpeningHour
      ).amPm;
      openingHourMsg += `${hour}:00 ${meridian} PST/PDT`;
    } else {
      const hour = this.utils.convert24hTo12hTime(
        this.configService.config['ADVANCE_BOOKING_HOUR']
      ).hour;
      const meridian = this.utils.convert24hTo12hTime(
        this.configService.config['ADVANCE_BOOKING_HOUR']
      ).amPm;
      openingHourMsg += `${hour}:00 ${meridian} PST/PDT (default)`;
    }
    let daysAheadMsg = '';
    if (facilityObj.bookingDaysAhead) {
      daysAheadMsg += facilityObj.bookingDaysAhead;
    } else if (facilityObj.bookingDaysAhead === 0) {
      daysAheadMsg += 'Same day';
    } else {
      daysAheadMsg += `${this.configService.config['ADVANCE_BOOKING_LIMIT']} (default)`;
    }
    message += this.utils.buildInnerHTMLRow([
      `<strong>Booking Opening Time:</strong></br>` + openingHourMsg,
      `<strong>Booking Days Ahead:</strong></br>` + daysAheadMsg,
    ]);

    let qrcodeMessage = '';
    if (facilityObj.qrcode) {
      qrcodeMessage += `<i class="bi bi-qr-code"></i>&nbsp;Enabled`;
    } else {
      qrcodeMessage += `Disabled`;
    }
    message += this.utils.buildInnerHTMLRow([
      `<strong>QR Codes:</strong></br>` + qrcodeMessage
    ]);

    let bookingDaysList = [];
    for (const day of Object.keys(facilityObj.bookingDays)) {
      if (facilityObj.bookingDays[day]) {
        const weekday =
          Constants.Weekdays.filter(
            (weekday) => String(weekday.id) === day
          )[0] || null;
        bookingDaysList.push(weekday?.name);
      }
    }
    message += `<hr>`;
    let capacityMsg = [];
    if (facilityObj.bookingTimes?.AM) {
      capacityMsg.push(
        `<strong>AM Capacity:</strong></br>` + facilityObj.bookingTimes?.AM?.max
      );
    }
    if (facilityObj.bookingTimes?.PM) {
      capacityMsg.push(
        `<strong>PM Capacity:</strong></br>` + facilityObj.bookingTimes?.PM?.max
      );
    }
    if (facilityObj.bookingTimes?.DAY) {
      capacityMsg.push(
        `<strong>All-day Capacity:</strong></br>` +
          facilityObj.bookingTimes?.DAY?.max
      );
    }
    message += this.utils.buildInnerHTMLRow(capacityMsg);

    message += `<hr>`;
    message += `<strong>Passes are required on the following days:</strong></br>`;
    message += bookingDaysList.join(', ');

    message +=
      `</br></br><strong>Passes-not-required text:</strong></br>` +
      facilityObj.bookingDaysRichText;

    return message;
  }

  navigateBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
