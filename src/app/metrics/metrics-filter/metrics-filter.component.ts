import { ChangeDetectorRef, Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { LoadingService } from 'src/app/services/loading.service';
import { BaseFormComponent } from 'src/app/shared/components/ds-forms/base-form/base-form.component';
import { Constants } from 'src/app/shared/utils/constants';

@Component({
  selector: 'app-metrics-filter',
  templateUrl: './metrics-filter.component.html',
  styleUrls: ['./metrics-filter.component.scss'],
})
export class MetricsFilterComponent extends BaseFormComponent {
  public params;
  public parkFacilitiesList;
  public timeSpanOptions = ['year', 'month', 'week'];
  public timeSpanLabels = ['12M', '30D', '7D'];
  public parkOptions = [];
  public facilityOptions = [];
  public fileTypeOptions = [
    { value: 'pdf', display: 'PDF' },
    { value: 'csv', display: 'CSV' },
    { value: 'json', display: 'JSON' },
  ];
  constructor(
    protected formBuilder: UntypedFormBuilder,
    protected router: Router,
    protected dataService: DataService,
    protected loadingService: LoadingService,
    protected changeDetector: ChangeDetectorRef
  ) {
    super(formBuilder, router, dataService, loadingService, changeDetector);
    this.subscriptions.add(
      this.dataService
        .watchItem(Constants.dataIds.PARK_AND_FACILITY_LIST)
        .subscribe((res) => {
          if (res) {
            this.parkFacilitiesList = res;
            this.createParksOptions(res);
          }
        })
    );
    this.subscriptions.add(
      this.dataService
        .watchItem(Constants.dataIds.METRICS_FILTERS_PARAMS)
        .subscribe((res) => {
          if (res) {
            this.params = res;
            this.data = this.params;
            this.setForm();
          }
        })
    );
    this.setForm();
  }

  setForm() {
    if (!this.data?.timeSpan) {
      this.data.timeSpan = this.timeSpanOptions[0];
    }
    this.form = new UntypedFormGroup({
      timeSpan: new UntypedFormControl(this.data.timeSpan),
      startDate: new UntypedFormControl(
        this.data.startDate,
        Validators.required
      ),
      endDate: new UntypedFormControl(this.data.endDate, Validators.required),
      park: new UntypedFormControl(this.data.park),
      facility: new UntypedFormControl(this.data.facility),
      fileType: new UntypedFormControl(this.data.fileType),
      exportPassBreakdownByStatus: new UntypedFormControl(
        this.data.exportPassBreakdownByStatus
      ),
      exportPassTrendsByHour: new UntypedFormControl(
        this.data.exportPassTrendsByHour
      ),
      exportReturningGuests: new UntypedFormControl(
        this.data.exportReturningGuests
      ),
      exportPassActivityByDay: new UntypedFormControl(
        this.data.exportPassActivityByDay
      ),
      exportBusiestDays: new UntypedFormControl(this.data.exportBusiestDays),
    });
    super.updateForm();
    super.addDisabledRule(
      this.fields.facility,
      () => {
        return this.fields.park.value ? false : true;
      },
      this.fields.park.valueChanges
    );
  }

  async onSubmit() {
    let res = await super.submit();
  }

  createParksOptions(list) {
    for (const park of Object.keys(list)) {
      this.parkOptions.push({ value: park, display: list[park].name });
    }
  }

  createFacilityOptions(list) {
    for (const facility of Object.keys(list)) {
      this.facilityOptions.push({
        value: list[facility].sk,
        display: list[facility].facilityName,
      });
    }
  }

  parkChange(event) {
    if (this.parkFacilitiesList) {
      const selectedPark = this.parkFacilitiesList[this.fields?.park?.value];
      if (selectedPark) {
        this.facilityOptions = [];
        for (const facility of Object.keys(selectedPark.facilities)) {
          this.facilityOptions.push({
            value: selectedPark.facilities[facility].sk,
            display: selectedPark.facilities[facility].name,
          });
        }
        // this.fields.park.setValue(selectedPark, {emitEvent: false});
        this.fields.facility.setValue(this.facilityOptions[0]?.value || null);
      }
    }
  }

  selectAllExports(select: boolean) {
    console.log('select:', select);
    if (select) {
      this.fields.exportBusiestDays.setValue(true);
      this.fields.exportPassActivityByDay.setValue(true);
      this.fields.exportPassTrendsByHour.setValue(true);
      this.fields.exportPassBreakdownByStatus.setValue(true);
      this.fields.exportReturningGuests.setValue(true);
    } else {
      this.fields.exportBusiestDays.setValue(false);
      this.fields.exportPassActivityByDay.setValue(false);
      this.fields.exportPassTrendsByHour.setValue(false);
      this.fields.exportPassBreakdownByStatus.setValue(false);
      this.fields.exportReturningGuests.setValue(false);
    }
  }
}
