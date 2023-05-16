import { ChangeDetectorRef, Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { LoadingService } from 'src/app/services/loading.service';
import { PassService } from 'src/app/services/pass.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { BaseFormComponent } from 'src/app/shared/components/ds-forms/base-form/base-form.component';
import { Constants } from 'src/app/shared/utils/constants';
import { DateTime } from 'luxon';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-passes-filter',
  templateUrl: './passes-filter.component.html',
  styleUrls: ['./passes-filter.component.scss'],
})
export class PassesFilterComponent extends BaseFormComponent {

  public parksAndFacilities;
  public passTypeOptions;
  public statusesList = ['reserved', 'active', 'expired', 'cancelled'];
  public overbookedList = [
    { value: 'all', display: 'Show all passes' },
    { value: 'show', display: 'Show overbooked only' },
    { value: 'hide', display: 'Hide overbooked' },
  ];
  public parkOptions: any[] = [];
  public facilityOptions: any[] = [];
  public searchOnPageLoadFlag = false;

  constructor(
    protected formBuilder: UntypedFormBuilder,
    protected router: Router,
    protected dataService: DataService,
    protected loadingService: LoadingService,
    protected changeDetector: ChangeDetectorRef,
    protected passService: PassService,
    protected reservationService: ReservationService,
    private route: ActivatedRoute,
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
        .watchItem(Constants.dataIds.PARK_AND_FACILITY_LIST)
        .subscribe((res) => {
          if (res) {
            this.parksAndFacilities = res;
            this.createParksOptions();
            if (this.fields?.park?.value) {
              this.createFacilitiesOptions(this.fields?.park?.value);
              if (this.fields?.facilityName?.value) {
                this.createPassTypeOptions(this.fields?.park?.value, this.fields?.facilityName?.value);
              }
            }
            this.updateFormFields();
          }
        }
        )
    )

    // If there are params in the url, fill the filters
    if (Object.keys(this.route.snapshot.queryParams).length > 0) {
      this.data = this.route.snapshot.queryParams;
      this.searchOnPageLoadFlag = true;
    } else {
      // set date to today
      const today = DateTime.now().setZone('America/Vancouver').toISODate();
      this.data.date = today;
    }
    this.parksAndFacilities = this.dataService.getItemValue(Constants.dataIds.PARK_AND_FACILITY_LIST);
    if (this.parksAndFacilities) {
      this.createParksOptions();
      if (this.data?.park) {
        this.createFacilitiesOptions(this.data?.park);
        if (this.data?.facilityName) {
          this.createPassTypeOptions(this.data?.park, this.data?.facilityName);
        }
      }
    }
    this.setForm();
  }

  createParksOptions() {
    this.parkOptions = [];
    for (const park in this.parksAndFacilities) {
      this.parkOptions.push({ value: this.parksAndFacilities[park]?.sk, display: this.parksAndFacilities[park]?.name });
    }
  }

  createFacilitiesOptions(park) {
    this.facilityOptions = [];
    if (park) {
      const facilities = this.parksAndFacilities[park]?.facilities;
      for (const facility in facilities) {
        this.facilityOptions.push({ value: facilities[facility]?.sk, display: facilities[facility]?.name });
      }

    }
  }

  createPassTypeOptions(park, facility) {
    this.passTypeOptions = [];
    if (park && facility && this.parksAndFacilities) {
      const bookingTimes = this.parksAndFacilities[park].facilities[facility]?.bookingTimes || null
      if (bookingTimes) {
        const passTypes = Object.keys(this.parksAndFacilities[park].facilities[facility].bookingTimes);
        for (const type of passTypes) {
          this.passTypeOptions.push({ value: type, display: type });
        }
      }
    }
  }

  setForm() {
    this.form = new UntypedFormGroup({
      date: new UntypedFormControl(this.data?.date || null),
      park: new UntypedFormControl(this.data?.park || null, Validators.required),
      facilityName: new UntypedFormControl(this.data?.facilityName || null, Validators.required),
      passType: new UntypedFormControl(this.data?.passType || null, Validators.required),
      passStatus: new UntypedFormControl(this.data?.passStatus || null),
      firstName: new UntypedFormControl(this.data?.firstName || null),
      lastName: new UntypedFormControl(this.data?.lastName || null),
      email: new UntypedFormControl(this.data?.email || null),
      reservationNumber: new UntypedFormControl(this.data?.reservationNumber || null),
      overbooked: new UntypedFormControl(this.data?.overbooked || 'all'),
    });

    // update form with new values
    super.updateForm();

    // add disabled rules to the form
    super.addDisabledRule(
      this.fields.facilityName,
      () => {
        const park = this.fields?.park?.value;
        if (!park) {
          return true;
        }
        return false;
      },
      this.fields.park.valueChanges
    );
    super.addDisabledRule(
      this.fields.passType,
      () => {
        if (this.fields?.facilityName?.disabled) {
          return true;
        }
        const facility = this.fields?.facilityName?.value;
        if (!facility) {
          return true;
        }
        return false;
      },
      this.fields.facilityName.valueChanges
    );

    // add subscriptions to changes in form value
    super.subscribeToControlValueChanges(
      this.fields.park,
      () => {
        this.createFacilitiesOptions(this.fields?.park?.value);
        if (this.fields?.facilityName && this.facilityOptions.length > 0) {
          this.fields?.facilityName?.setValue(this.facilityOptions[0].value);
        }
      }
    );
    super.subscribeToControlValueChanges(
      this.fields.facilityName,
      () => {
        this.createPassTypeOptions(this.fields?.park?.value, this.fields?.facilityName?.value);
        if (this.fields.passType && this.passTypeOptions.length > 0) {
          this.fields.passType.setValue(this.passTypeOptions[0].value);
        }
      }
    );

    super.subscribeToFormValueChanges(
      () => { this.updateUrl() }
    );

    this.updateUrl();

    // If there are mandatory params in the url, search for them now
    if (this.searchOnPageLoadFlag && this.checkFieldsForSubmission()) {
      // wait for parksAndFacilities to be loaded
      let autofetchReady = new Subject();
      this.dataService.watchItem(Constants.dataIds.PARK_AND_FACILITY_LIST).pipe(
        takeUntil(autofetchReady)
      ).subscribe(() => {
        this.onSubmit();
        autofetchReady.complete();
      });
    }
    this.searchOnPageLoadFlag = false;
  }


  updateFormFields() {
    for (const field of Object.keys(this.fields)) {
      this.fields[field].setValue(this.data[field], { emitEvent: false });
    }
  }

  clearForm() {
    this.dataService.setItemValue(Constants.dataIds.PASSES_LIST, null);
    this.reset();
    this.data = {
      park: null
    };
    this.setForm();
  }

  // Don't allow search submission if mandatory fields are missing
  checkFieldsForSubmission() {
    if (
      this.fields.park.value &&
      this.fields.facilityName.value &&
      this.fields.passType.value
    ) {
      return true;
    }
    return false;
  }

  validateFields(fields) {
    // Check park
    if (!this.checkFieldsForSubmission) {
      return false;
    }
    if (this.parksAndFacilities) {
      let hasPark = Object.keys(this.parksAndFacilities).find((park) =>
        park === fields.park
      )
      if (!hasPark) {
        return false;
      }
      if (fields.facilityName) {
        let hasFacility = Object.keys(this.parksAndFacilities[fields.park]?.facilities).find((facility) =>
          facility === fields.facilityName
        );
        if (!hasFacility) {
          return false;
        }
        if (fields.passType) {
          let hasPassType = Object.keys(this.parksAndFacilities[fields.park]?.facilities[fields.facilityName]?.bookingTimes).find((type) =>
            type === fields.passType
          );
          if (!hasPassType) {
            return false;
          }
        }
      }
    } else {
      return false;
    }
    return true;
  }

  async onSubmit() {
    // Save current search params
    const res = await super.submit();

    // delete unused fields
    for (const field in res.fields) {
      if (res.fields[field] === null) {
        delete res.fields[field];
      }
    }

    if (this.validateFields(res.fields)) {
      // update current park and facility
      this.dataService.setItemValue(Constants.dataIds.CURRENT_PARK_KEY, { pk: 'park', sk: res.fields.park });
      this.dataService.setItemValue(Constants.dataIds.CURRENT_FACILITY_KEY, { pk: `facilty::${res.fields.park}`, sk: res.fields.facilityName });
      this.passService.fetchData(res.fields);
      this.reservationService.fetchData(
        res.fields?.park,
        res.fields.facilityName,
        res.fields?.date || null,
        res.fields?.passType || null
      );
      this.dataService.setItemValue(Constants.dataIds.PASS_SEARCH_PARAMS, this.updateUrl());
    }
  }

  async updateUrl() {
    const res = await super.submit();
    const queryParams = { ...res.fields };
    if (queryParams.passStatus?.length) {
      queryParams.passStatus = queryParams.passStatus.toString();
    }
    // set current park & facility keys
    // don't include a facility or passtype in the url if it doesn't belong to a park
    // remove parks/facilities/passtypes that do not exist. 
    if (queryParams.park && this.parksAndFacilities) {
      let hasPark = Object.keys(this.parksAndFacilities).find((park) =>
        park === queryParams.park
      )
      if (!hasPark) {
        delete queryParams.park;
        delete queryParams.facilityName;
        delete queryParams.passType;
      }
      if (queryParams.facilityName) {
        let hasFacility = Object.keys(this.parksAndFacilities[queryParams.park]?.facilities).find((facility) =>
          facility === queryParams.facilityName
        );
        if (!hasFacility) {
          delete queryParams.facilityName;
          delete queryParams.passType;
        }
        if (queryParams.passType) {
          let hasPassType = Object.keys(this.parksAndFacilities[queryParams.park]?.facilities[queryParams.facilityName]?.bookingTimes).find((passType) =>
            passType === queryParams.passType
          );
          if (!hasPassType) {
            delete queryParams.passType;
          }
        }
      }
    }

    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: queryParams,
    });

    return queryParams;
  }
}
