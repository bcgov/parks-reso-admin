import { ChangeDetectorRef, Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
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
    protected reservationService: ReservationService
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
    this.setForm();
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

  setForm() {
    this.form = new UntypedFormGroup({
      passType: new UntypedFormControl({
        value: this.data.passType,
        disabled: this.loading,
      }),
      passDate: new UntypedFormControl({
        value: this.data.date,
        disabled: this.loading,
      }),
      passStatus: new UntypedFormControl({
        value: this.data.passStatus,
        disabled: this.loading,
      }),
      passFirstName: new UntypedFormControl({
        value: this.data.firstName,
        disabled: this.loading,
      }),
      passLastName: new UntypedFormControl({
        value: this.data.lastName,
        disabled: this.loading,
      }),
      passEmail: new UntypedFormControl({
        value: this.data.email,
        disabled: this.loading,
      }),
      passReservationNumber: new UntypedFormControl({
        value: this.data.reservationNumber,
        disabled: this.loading,
      }),
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
      passStatus: filters.passStatus ? filters.passStatus.join(',') : null,
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
