import { Component, OnDestroy, OnInit } from '@angular/core';
import { Utils } from 'src/app/shared/utils/utils';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { Constants } from 'src/app/shared/utils/constants';
import { FormControl, FormGroup } from '@angular/forms';
import { PassService } from 'src/app/services/pass.service';

@Component({
  selector: 'app-manual-entry',
  templateUrl: './manual-entry.component.html',
  styleUrls: ['./manual-entry.component.scss'],
})
export class ManualEntryComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  public parks = {};
  public parkOptions = [];
  public facilityOptions = [];

  public searchForm: FormGroup;

  // Always set date to today and disable form.
  public today = new Utils().getTodayAsShortDate();
  private disableDate = true;
  public disableSubmit = true;
  public searching = false;

  public noResults = false;

  constructor(
    private dataService: DataService,
    private passService: PassService
  ) {
    this.subscriptions.add(
      this.dataService
        .watchItem(Constants.dataIds.PARK_AND_FACILITY_LIST)
        .subscribe((res) => {
          if (res) {
            // Make sure we reset every time autofetcher gets parks.
            this.parks = [];
            for (const parkKey in res) {
              // Populate select park form
              this.parkOptions.push({
                label: res[parkKey].name,
                value: res[parkKey].sk,
              });

              res[parkKey].facilityOptions = [];
              for (const facilityKey in res[parkKey].facilities) {
                res[parkKey].facilityOptions.push({
                  label: res[parkKey].facilities[facilityKey].name,
                  value: res[parkKey].facilities[facilityKey].sk,
                });
              }

              this.parks = res;
            }
          }
        })
    );
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.searchForm = new FormGroup({
      date: new FormControl({
        value: this.today,
        disabled: this.disableDate,
      }),
      park: new FormControl(''),
      facilityName: new FormControl({ value: '', disabled: true }),
      registrationNumber: new FormControl({
        value: '',
        disabled: true,
      }),
      firstName: new FormControl({ value: '', disabled: true }),
      lastName: new FormControl({ value: '', disabled: true }),
      email: new FormControl({ value: '', disabled: true }),
    });

    // Allow us to keep park and facility selected in a session
    // TODO: Make this load from an individual's profile instead of per session.
    const cachedPark = this.dataService.getItemValue(
      Constants.dataIds.PASS_LOOKUP_PARK_SELECT_CACHE
    );
    if (cachedPark) {
      this.searchForm.get('park').setValue(cachedPark);
      this.onParkSelect(cachedPark);
      const cachedFacility = this.dataService.getItemValue(
        Constants.dataIds.PASS_LOOKUP_FACILITY_SELECT_CACHE
      );
      if (cachedFacility) {
        this.searchForm.get('facilityName').setValue(cachedFacility);
        this.onFacilitySelect(cachedFacility);
      }
    }
  }

  onParkSelect(selectedValue) {
    this.searchForm.get('facilityName').reset();
    if (this.parks[selectedValue]) {
      this.facilityOptions = this.parks[selectedValue].facilityOptions;
      this.searchForm.get('facilityName').enable();
    } else {
      this.searchForm.get('facilityName').disable();
    }
    this.clearFilters();
    this.disableFilters();
    this.dataService.setItemValue(
      Constants.dataIds.PASS_LOOKUP_PARK_SELECT_CACHE,
      selectedValue
    );
  }

  onFacilitySelect(selectedValue) {
    this.clearFilters();
    if (selectedValue) {
      this.enableFilters();
    } else {
      this.disableFilters();
    }
    this.dataService.setItemValue(
      Constants.dataIds.PASS_LOOKUP_FACILITY_SELECT_CACHE,
      selectedValue
    );
  }

  onFilterSelect(control) {
    if (
      this.searchForm.get('registrationNumber').value ||
      this.searchForm.get('firstName').value ||
      this.searchForm.get('lastName').value ||
      this.searchForm.get('email').value
    ) {
      this.disableSubmit = false;
    } else {
      this.disableSubmit = true;
    }
  }

  clearFilters() {
    this.searchForm.get('registrationNumber').reset();
    this.searchForm.get('firstName').reset();
    this.searchForm.get('lastName').reset();
    this.searchForm.get('email').reset();
  }

  disableFilters() {
    this.searchForm.get('registrationNumber').disable();
    this.searchForm.get('firstName').disable();
    this.searchForm.get('lastName').disable();
    this.searchForm.get('email').disable();
  }

  enableFilters() {
    this.searchForm.get('registrationNumber').enable();
    this.searchForm.get('firstName').enable();
    this.searchForm.get('lastName').enable();
    this.searchForm.get('email').enable();
  }

  async onSubmit() {
    this.disableSubmit = this.searching = true;
    this.noResults = false;
    let obj = this.searchForm.value;
    Object.keys(obj).forEach((key) => {
      if (!obj[key]) {
        delete obj[key];
      }
    });
    obj['date'] = this.searchForm.get('date').value;
    obj.manualLookup = true;
    const res = await this.passService.fetchData(obj);
    this.noResults = res.length === 0;
    this.disableSubmit = this.searching = false;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
