import { ChangeDetectorRef, Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { LoadingService } from 'src/app/services/loading.service';
import { PassService } from 'src/app/services/pass.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { BaseFormComponent } from 'src/app/shared/components/ds-forms/base-form/base-form.component';
import { Constants } from 'src/app/shared/utils/constants';

@Component({
  selector: 'app-passes-filter',
  templateUrl: './passes-filter.component.html',
  styleUrls: ['./passes-filter.component.scss'],
})
export class PassesFilterComponent extends BaseFormComponent {
  private facility;

  public bookingTimesList;
  public statusesList = ['reserved', 'active', 'expired', 'cancelled'];
  public overbookedList = [
    { value: 'all', display: 'Show all passes' },
    { value: 'show', display: 'Show overbooked only' },
    { value: 'hide', display: 'Hide overbooked' },
  ];

  constructor(
    protected formBuilder: UntypedFormBuilder,
    protected router: Router,
    protected dataService: DataService,
    protected loadingService: LoadingService,
    protected changeDetector: ChangeDetectorRef,
    protected passService: PassService,
    protected reservationService: ReservationService,
    private route: ActivatedRoute
  ) {
    super(
      formBuilder,
      router,
      dataService,
      loadingService,
      changeDetector
    );

    this.subscriptions.add(
      this.dataService
        .watchItem(Constants.dataIds.CURRENT_FACILITY)
        .subscribe((res) => {
          if (res) {
            this.facility = res;
            this.bookingTimesList = this.getBookingTimesList();
          }
        })
    );

    // push existing form data to parent subscriptions
    this.subscriptions.add(
      this.dataService
        .watchItem(Constants.dataIds.PASS_SEARCH_PARAMS)
        .subscribe((res) => {
          if (res) {
            this.data = res;
            this.setForm();
          }
        })
    );
    this.initializeForm();
  }

  getBookingTimesList() {
    if (this.facility?.bookingTimes) {
      let list: any[] = [];
      for (const key of Object.keys(this.facility.bookingTimes)) {
        list.push({ value: key, display: key });
      }
      return list;
    }
    return [];
  }

  initializeForm() {
    // First pass of form initialization, establish disabledRules (if any)
    this.setForm();
  }

  setForm() {
    this.form = new UntypedFormGroup({
      passType: new UntypedFormControl(this.data.passType),
      date: new UntypedFormControl(this.data.date),
      passStatus: new UntypedFormControl(this.data.passStatus),
      firstName: new UntypedFormControl(this.data.firstName),
      lastName: new UntypedFormControl(this.data.lastName),
      email: new UntypedFormControl(this.data.email),
      reservationNumber: new UntypedFormControl(this.data.reservationNumber),
      overbooked: new UntypedFormControl(this.data.overbooked),
    });
    super.setFields();
  }

  async onSubmit() {
    // Save current search params
    const res = await super.submit();
    const resFields = await this.passService.filterSearchParams(res.fields);

    this.updateUrl(resFields);

    let params = Object.assign(resFields, {
      park: this.facility.pk.split('::')[1],
      facilityName: this.facility.sk,
      passType: resFields?.passType || null,
    });
    this.passService.fetchData(params);

    this.reservationService.fetchData(
      this.facility.pk.split('::')[1],
      this.facility.sk,
      resFields?.date || null,
      resFields?.passType || null
    );
  }

  updateUrl(resFields) {
    const queryParams = { ...resFields };
    delete queryParams.park;
    delete queryParams.facilityName;
    if (queryParams.passStatus) {
      queryParams.passStatus = queryParams.passStatus.toString();
    }
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: queryParams,
    });
  }
}
