import { ChangeDetectorRef, Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { FormService } from 'src/app/services/form.service';
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
  // @Input() facility;
  private facility;

  public bookingTimesList;
  public statusesList = ['reserved', 'active', 'expired', 'cancelled'];

  constructor(
    protected formBuilder: UntypedFormBuilder,
    protected formService: FormService,
    protected router: Router,
    protected dataService: DataService,
    protected loadingService: LoadingService,
    protected changeDetectior: ChangeDetectorRef,
    protected passService: PassService,
    protected reservationService: ReservationService,
    private route: ActivatedRoute
  ) {
    super(
      formBuilder,
      formService,
      router,
      dataService,
      loadingService,
      changeDetectior
    );

    this.subscriptions.add(
      this.dataService
        .watchItem(Constants.dataIds.CURRENT_FACILITY)
        .subscribe((res) => {
          if (res) {
            this.facility = res[0];
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
      passDate: new UntypedFormControl(this.data.date),
      passStatus: new UntypedFormControl(this.data.passStatus),
      passFirstName: new UntypedFormControl(this.data.firstName),
      passLastName: new UntypedFormControl(this.data.lastName),
      passEmail: new UntypedFormControl(this.data.email),
      passReservationNumber: new UntypedFormControl(
        this.data.reservationNumber
      ),
    });
    this.fields = {
      passType: this.form.get('passType'),
      passDate: this.form.get('passDate'),
      passStatus: this.form.get('passStatus'),
      passFirstName: this.form.get('passFirstName'),
      passLastName: this.form.get('passLastName'),
      passEmail: this.form.get('passEmail'),
      passReservationNumber: this.form.get('passReservationNumber'),
    };
  }

  cleanSearchParams(filters) {
    let filterMap = {
      date: filters.passDate || null,
      reservationNumber: filters.passReservationNumber || null,
      passStatus: filters.passStatus ? filters.passStatus : null,
      firstName: filters.passFirstname || null,
      lastName: filters.passLastName || null,
      email: filters.passEmail || null,
      passType: filters.passType || null,
    };
    for (let item of Object.keys(filterMap)) {
      if (!filterMap[item]) {
        delete filterMap[item];
      }
    }
    return filterMap;
  }

  async onSubmit() {
    // Save current search params
    const res = await super.submit();
    const resFields = await this.cleanSearchParams(res.fields);
    const queryParams = { ...resFields };
    if (queryParams.passStatus) {
      queryParams.passStatus = queryParams.passStatus.toString();
    }

    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: queryParams,
    });

    let params = Object.assign(resFields, {
      parkSk: this.facility.pk.split('::')[1],
      facilitySk: this.facility.sk,
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
}
