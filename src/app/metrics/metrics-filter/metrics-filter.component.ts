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
import { MetricsService } from 'src/app/services/metrics.service';
import { BaseFormComponent } from 'src/app/shared/components/ds-forms/base-form/base-form.component';
import { Constants } from 'src/app/shared/utils/constants';
import { DateTime } from 'luxon';

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
  public metrics = [];
  public timezone = 'America/Vancouver';
  public count = 0;
  public minDate;
  public maxDate;

  constructor(
    protected formBuilder: UntypedFormBuilder,
    protected router: Router,
    protected dataService: DataService,
    protected loadingService: LoadingService,
    protected changeDetector: ChangeDetectorRef,
    protected metricsService: MetricsService,
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
    // grab existing metrics filter params, if theres any. 
    this.data = this.dataService.getItemValue(Constants.dataIds.METRICS_FILTERS_PARAMS);
    if (this.data.park) {
      this.createParksOptions(this.parkFacilitiesList);
      this.createFacilityOptions(this.parkFacilitiesList[this.data.park].facilities);
    };
    this.setForm();
  }

  setForm() {
    this.form = new UntypedFormGroup({
      timeSpan: new UntypedFormControl(this.data.timeSpan),
      dateRange: new UntypedFormControl(
        this.data.dateRange,
        Validators.required
      ),
      park: new UntypedFormControl(this.data.park),
      facility: new UntypedFormControl(this.data.facility),
    });
    super.updateForm();
    super.addDisabledRule(
      this.fields.facility,
      () => {
        const park = this.fields?.park?.value;
        if (!park || park === 'all') {
          return true;
        }
        return false;
      },
      this.fields.park.valueChanges
    );
    super.subscribeToControlValueChanges(this.fields.facility, () => { this.onSubmit() })
    super.subscribeToControlValueChanges(this.fields.dateRange, () => { this.onSubmit() })
  }

  async onSubmit() {
    let res = await super.submit();
    let fields = res.fields;
    if (this.validateMetricsParams(fields) && !this.loading) {
      this.metricsService.setFilterParams(fields);
      // Get everything
      if (fields.park === 'all') {
        this.metricsService.fetchData(fields.dateRange[0], fields.dateRange[1]);
        return;
      } else if (fields.facility === 'all') {
        // Get all facilities
        this.metricsService.fetchData(fields.dateRange[0], fields.dateRange[1], fields.park);
        return;
      } else {
        this.metricsService.fetchData(fields.dateRange[0], fields.dateRange[1], fields.park, fields.facility);
      }
    }
  }

  validateMetricsParams(fields): boolean {
    if (
      !fields.park ||
      !fields.dateRange
    ) {
      return false;
    }
    if (fields.park !== 'all' && !fields.facility) {
      return false;
    }
    return true;
  }

  createParksOptions(list) {
    let optionsList = [{
      value: 'all',
      display: 'All Parks'
    },
    {
      value: null,
      display: null,
      disabled: true,
      breakpoint: true
    }
    ];
    for (const park of Object.keys(list)) {
      optionsList.push({ value: park, display: list[park].name });
    }
    this.parkOptions = optionsList;
  }

  createFacilityOptions(list) {
    let optionsList = [{
      value: 'all',
      display: 'All Facilities'
    },
    {
      value: null,
      display: null,
      disabled: true,
      breakpoint: true
    }
    ];
    for (const facility in list) {
      optionsList.push({
        value: list[facility].sk,
        display: list[facility].name,
      });
    }
    this.facilityOptions = optionsList;
  }

  parkChange(event) {
    const park = this.fields?.park?.value;
    if (!park || park === 'all') {
      this.fields.facility.setValue(undefined);
      return;
    }
    if (this.parkFacilitiesList) {
      const selectedPark = this.parkFacilitiesList[this.fields?.park?.value];
      if (selectedPark) {
        this.createFacilityOptions(selectedPark.facilities);
        this.fields.facility.setValue(this.facilityOptions[2]?.value || this.facilityOptions[0]?.value || null);
      }
    }
  }

  facilityChange(event) {
    const facility = this.fields?.facility?.value;
    if (!facility || facility === 'all') {
      this.fields.passType.setValue(undefined);
      return;
    }
  }

  presetRange(range) {
    const today = DateTime.now().setZone(this.timezone);
    const endDate = today.toISODate();
    let startDate;
    switch (range) {
      case 'year':
        startDate = today.minus({ months: 12 }).toISODate();
        break;
      case 'month':
        startDate = today.minus({ days: 30 }).toISODate();
        break;
      case 'week':
        startDate = today.minus({ days: 7 }).toISODate();
        break;
      default:
        startDate = endDate;
    }
    this.fields.dateRange.setValue([startDate, endDate]);
  }
}
