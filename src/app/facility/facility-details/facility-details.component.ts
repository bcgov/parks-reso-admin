import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ConfigService } from 'app/services/config.service';
import { FacilityService } from 'app/services/facility.service';
import { PassService } from 'app/services/pass.service';
import { RescountService } from 'app/services/rescount.service';
import { PassUtils } from 'app/shared/utils/pass-utils';
import { Constants } from 'app/shared/utils/constants';
import { takeWhile } from 'rxjs/operators';
import { Utils } from 'app/shared/utils/utils';
import {
  FilterObject,
  FilterType,
  MultiSelectDefinition
} from 'app/shared/components/search-filter-template/filter-object';
import { ApiService } from 'app/services/api.service';
import { ToastService } from 'app/services/toast.service';

@Component({
  selector: 'app-facility-details',
  templateUrl: './facility-details.component.html',
  styleUrls: ['./facility-details.component.scss']
})
export class FacilityDetailsComponent implements OnInit, OnDestroy {
  private alive = true;

  public loadingFacility = true;
  public loadingAM = true;
  public loadingPM = true;
  public loadingDAY = true;

  public facility;
  public passes;
  public reservations;

  public passTypeSelected = 'AM';

  public loadingSearch = false;

  // Default to today's date on page load
  public searchParams = {
    date: new Date()
  };

  public parkSk;
  public facilitySk;

  public bookingTimeSummary = {
    capPercent: 0,
    reserved: null,
    capacity: null,
    style: 'success'
  };

  public passMultiSelectOptions = new FilterObject(
    'passStatus',
    FilterType.MultiSelect,
    'Pass Status',
    new MultiSelectDefinition(['active', 'reserved', 'cancelled', 'expired'])
  );

  public formComponents = [
    {
      formType: 'select',
      label: 'Pass Type',
      value: 'passType',
      options: []
    },
    {
      formType: 'date',
      label: 'Date',
      value: 'date',
      // Default to today's date on page load
      initialValue: new Date()
    },
    {
      formType: 'autoMultiSelect',
      label: 'Pass Status',
      value: 'passStatus',
      multiSelectOptions: this.passMultiSelectOptions
    },
    {
      formType: 'text',
      label: 'First Name',
      value: 'firstName',
      initialValue: undefined
    },
    {
      formType: 'text',
      label: 'Last Name',
      value: 'lastName',
      initialValue: undefined
    },
    {
      formType: 'text',
      label: 'Email',
      value: 'email',
      initialValue: undefined
    },
    {
      formType: 'text',
      label: 'Reservation Number',
      value: 'reservationNumber',
      initialValue: undefined
    }
  ];

  constructor(
    private configService: ConfigService,
    private apiService: ApiService,
    private toastService: ToastService,
    private facilityService: FacilityService,
    public passService: PassService,
    public rescountService: RescountService,
    private _changeDetectionRef: ChangeDetectorRef,
    private utils: Utils
  ) {}

  ngOnInit() {
    this.facilityService
      .getItemValue()
      .pipe(takeWhile(() => this.alive))
      .subscribe(res => {
        if (res) {
          this.facility = res;
          this.facilitySk = res.sk;
          this.parkSk = res.pk.replace('facility::', '');

          // Default order AM > PM > DAY
          if (this.facility) {
            this.setInitialPassType(this.facility.bookingTimes);
          }

          this.calculateCapacityLevels();
          this.loadingFacility = false;
          this._changeDetectionRef.detectChanges();
        }
      });
    this.passService
      .getListValue()
      .pipe(takeWhile(() => this.alive))
      .subscribe(res => {
        if (res) {
          this.passes = res.data;

          this.loadingAM = false;
          this.loadingPM = false;
          this.loadingDAY = false;
          this.loadingSearch = false;
          this._changeDetectionRef.detectChanges();
        }
      });
    this.rescountService
      .getItemValue()
      .pipe(takeWhile(() => this.alive))
      .subscribe(res => {
        if (res) {
          this.reservations = res;
          this.calculateCapacityLevels();
          this._changeDetectionRef.detectChanges();
        }
      });
  }

  async exportCsv() {
    try {
      let obj = {
        facilityName: this.facilitySk,
        park: this.parkSk,
        email: this.searchParams['email'],
        date: this.searchParams['date'],
        firstName: this.searchParams['firstName'],
        lastName: this.searchParams['lastName'],
        passStatus: this.searchParams['passStatus'],
        reservationNumber: this.searchParams['reservationNumber']
      };
      Object.keys(obj).forEach(key => (obj[key] === undefined ? delete obj[key] : {}));
      const res = await this.apiService.get('export-pass', obj);
      window.open(res.signedURL, '_blank').focus();
    } catch (e) {
      this.toastService.addMessage('Failed Exporting Passes:' + e.msg, 'Export Passes', Constants.ToastTypes.SUCCESS);
    }
  }

  print(): void {
    this._changeDetectionRef.detectChanges();
    const printContent = document.getElementById('print-area');
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write(
      `<style>
        table {
            border-collapse: collapse;
            width: 100%;
        }

        td,
        th {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
        }
      </style>`
    );
    WindowPrt.document.write(`<h4>${this.passTypeSelected} passes for ${this.facility.name}</h4>`);
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }

  copyEmails(): void {
    PassUtils.copyEmailToClipboard(this.passes);
  }

  convertDate(date) {
    return new Date(date).toISOString().slice(0, 10);
  }

  filterPasses(params) {
    this.loadingSearch = true;
    this.searchParams = params;
    if (this.searchParams['passType']) {
      this.passTypeSelected = this.searchParams['passType'];
      delete this.searchParams['passType'];
      this.bookingTimeSummary.capacity = this.facility.bookingTimes[this.passTypeSelected].max;
      this.calculateCapacityLevels();
    }

    this.passService.fetchData(
      null,
      this.parkSk,
      this.facilitySk,
      this.passTypeSelected,
      null,
      null,
      this.searchParams
    );

    this.rescountService.fetchData(
      this.parkSk,
      this.facilitySk,
      new Date(this.searchParams.date).toLocaleDateString('en-CA')
    );
  }

  get bookingOpeningHourText() {
    const facilityBookingOpeningHour = this.facility ? this.facility.bookingOpeningHour : null;
    const advanceBookingHour =
      facilityBookingOpeningHour || parseInt(this.configService.config['ADVANCE_BOOKING_HOUR'], 10);
    const { hour, amPm } = this.utils.convert24hTo12hTime(advanceBookingHour);

    if (hour && amPm) {
      return `${hour} ${amPm}`;
    }
    return '';
  }

  get bookingDaysAheadText() {
    let advanceBookingDays = this.facility ? this.facility.bookingDaysAhead : null;
    if (advanceBookingDays !== 0 && !advanceBookingDays) {
      advanceBookingDays = parseInt(this.configService.config['ADVANCE_BOOKING_LIMIT'], 10);
    }

    if (advanceBookingDays === 0) {
      return 'Same Day';
    }
    if (advanceBookingDays === 1) {
      return '1 day';
    }

    return `${advanceBookingDays} days`;
  }

  public calculateCapacityLevels() {
    if (this.searchParams && this.searchParams.date) {
      if (this.reservations && this.reservations[this.passTypeSelected]) {
        this.bookingTimeSummary.reserved = this.reservations[this.passTypeSelected];
      } else {
        this.bookingTimeSummary.reserved = 0;
      }

      this.bookingTimeSummary.capPercent = Math.floor(
        (this.bookingTimeSummary.reserved / this.bookingTimeSummary.capacity) * 100
      );
      this.bookingTimeSummary.style = this.calculateProgressBarColour(this.bookingTimeSummary.capPercent);
    } else {
      this.bookingTimeSummary.reserved = null;
      this.bookingTimeSummary.capPercent = 0;
    }
  }

  public calculateProgressBarColour(capPercent) {
    if (capPercent < 25) {
      return 'success';
    } else if (capPercent < 75) {
      return 'warning';
    } else {
      return 'danger';
    }
  }

  private setInitialPassType(bookingTimes) {
    // Default select to first item
    const initSelect = 0;

    let passTypes = [];

    if ('AM' in bookingTimes) {
      passTypes.push('AM');
    }
    if ('PM' in bookingTimes) {
      passTypes.push('PM');
    }
    if ('DAY' in bookingTimes) {
      passTypes.push('DAY');
    }

    for (let i = 0; i < passTypes.length; i++) {
      this.formComponents[0].options.push({
        selectValue: passTypes[i],
        selectLabel: passTypes[i],
        initialValue: false
      });
      if (i === initSelect) {
        this.passTypeSelected = passTypes[i];
        this.formComponents[0].options[i].initialValue = true;
      }
    }
    this.bookingTimeSummary.capacity = bookingTimes[this.passTypeSelected].max;
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
