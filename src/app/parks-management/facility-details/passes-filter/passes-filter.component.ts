import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
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
import { BaseFormComponent } from 'src/app/shared/components/ds-forms/base-form/base-form.component';
import { Constants } from 'src/app/shared/utils/constants';

@Component({
  selector: 'app-passes-filter',
  templateUrl: './passes-filter.component.html',
  styleUrls: ['./passes-filter.component.scss'],
})
export class PassesFilterComponent extends BaseFormComponent {
  @Input() facility;

  public bookingTimesList;
  public statusesList = ['reserved', 'active', 'expired', 'cancelled'];

  constructor(
    protected formBuilder: UntypedFormBuilder,
    protected formService: FormService,
    protected router: Router,
    protected dataService: DataService,
    protected loadingService: LoadingService,
    protected changeDetectior: ChangeDetectorRef,
    protected passService: PassService
  ) {
    super(
      formBuilder,
      formService,
      router,
      dataService,
      loadingService,
      changeDetectior
    );

    // push existing form data to parent subscriptions
    this.subscriptions.add(
      this.dataService
        .watchItem(Constants.dataIds.PASS_SEARCH_PARAMS)
        .subscribe((res) => {
          if (res) {
            this.data = res;
            this.bookingTimesList = this.getBookingTimesList();
            this.setForm();
          }
        })
    );
    this.setForm();
  }

  getBookingTimesList() {
    if (this.facility?.bookingTimes){
      let list: any[] = [];
      for (const key of Object.keys(this.facility.bookingTimes)) {
        list.push({value: key, display: key})
      }
      return list;
    }
    return [];
  }

  setForm() {
    (this.form = new UntypedFormGroup({
      passTypeControl: new UntypedFormControl({
        value: this.data.passType,
        disabled: this.loading,
      }),
      passDateControl: new UntypedFormControl({
        value: this.data.date,
        disabled: this.loading,
      }),
      passStatusControl: new UntypedFormControl({
        value: this.data.passStatus,
        disabled: this.loading,
      }),
      passFirstNameControl: new UntypedFormControl({
        value: this.data.firstName,
        disabled: this.loading,
      }),
      passLastNameControl: new UntypedFormControl({
        value: this.data.lastName,
        disabled: this.loading,
      }),
      passEmailControl: new UntypedFormControl({
        value: this.data.email,
        disabled: this.loading,
      }),
      passReservationNumberControl: new UntypedFormControl({
        value: this.data.reservationNumber,
        disabled: this.loading,
      }),
    })),
      (this.fields = {
        passType: this.form.get('passTypeControl'),
        passDate: this.form.get('passDateControl'),
        passStatus: this.form.get('passStatusControl'),
        passFirstName: this.form.get('passFirstNameControl'),
        passLastName: this.form.get('passLastNameControl'),
        passEmail: this.form.get('passEmailControl'),
        passReservationNumber: this.form.get('passReservationNumberControl'),
      });

    super.subscribeToChanges();
  }

  async onSubmit() {
    // Save current search params
    const res = await super.submit();
    const resFields = await this.passService.updateSearchParams(res.fields, this.facility);
    let params = {
      parkSk: this.facility.pk.split('::')[1],
      facilitySk: this.facility.sk,
      passType: resFields?.passType || null
    };
    this.passService.fetchData(params);
  }
}
