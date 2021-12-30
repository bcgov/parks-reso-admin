import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ConfigService } from 'app/services/config.service';
import { FacilityService } from 'app/services/facility.service';
import { PassService } from 'app/services/pass.service';
import { PassUtils } from 'app/shared/utils/pass-utils';
import { takeWhile } from 'rxjs/operators';
import { Utils } from 'app/shared/utils/utils';

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

  // Default to today's date on page load
  public datePickerArray = [
    {
      label: 'Date',
      value: 'date',
      initialValue: new Date()
    }
  ];
  public textSearchArray = [
    {
      label: 'First Name',
      value: 'firstName',
      initialValue: undefined
    },
    {
      label: 'Last Name',
      value: 'lastName',
      initialValue: undefined
    },
    {
      label: 'Reservation Number',
      value: 'reservationNumber',
      initialValue: undefined
    }
  ];

  constructor(
    private configService: ConfigService,
    private facilityService: FacilityService,
    public passService: PassService,
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
            if (this.facility.bookingTimes.AM) {
              this.passTypeSelected = 'AM';
            } else if (this.facility.bookingTimes.PM) {
              this.passTypeSelected = 'PM';
            } else if (this.facility.bookingTimes.DAY) {
              this.passTypeSelected = 'DAY';
            }
            this.bookingTimeSummary.capacity = this.facility.bookingTimes[this.passTypeSelected].max;
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
  }

  fetchPassTable(time) {
    if (time === this.passTypeSelected) {
      return;
    }
    switch (time) {
      case 'AM':
        this.loadingAM = true;
        break;
      case 'PM':
        this.loadingPM = true;
        break;
      case 'DAY':
        this.loadingDAY = true;
        break;
      default:
        break;
    }
    this.passTypeSelected = time;
    this.bookingTimeSummary.capacity = this.facility.bookingTimes[this.passTypeSelected].max;
    this.calculateCapacityLevels();
    this.passService.fetchData(
      null,
      this.parkSk,
      this.facilitySk,
      time,
      null,
      null,
      this.passService.lastSearchParams.queryParams
    );
  }

  exportCsv(): void {
    PassUtils.exportToCsv(this.passes, this.facility.type);
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

    this.calculateCapacityLevels();

    this.passService.fetchData(
      null,
      this.parkSk,
      this.facilitySk,
      this.passTypeSelected,
      null,
      null,
      this.searchParams
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

  ngOnDestroy() {
    this.alive = false;
  }

  public calculateCapacityLevels() {
    if (this.searchParams && this.searchParams.date) {
      const formattedDate = new Date(this.searchParams.date).toLocaleDateString('en-CA');
      if (
        this.facility.reservations[formattedDate] &&
        this.facility.reservations[formattedDate][this.passTypeSelected]
      ) {
        this.bookingTimeSummary.reserved = this.facility.reservations[formattedDate][this.passTypeSelected];
      } else {
        this.bookingTimeSummary.reserved = 0;
      }

      this.bookingTimeSummary.capPercent = Math.floor((this.bookingTimeSummary.reserved / this.bookingTimeSummary.capacity) * 100);
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
}
