import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmComponent } from 'app/confirm/confirm.component';
import { DialogService } from 'ng2-bootstrap-modal';
import { Constants } from '../shared/utils/constants';
import { takeWhile } from 'rxjs/operators';
import { FacilityService } from 'app/services/facility.service';
import { PostFacility, PutFacility } from 'app/models/facility';
import { ParkService } from 'app/services/park.service';
import { ToastService } from 'app/services/toast.service';

@Component({
  selector: 'app-facility-form',
  templateUrl: './facility-form.component.html',
  styleUrls: ['./facility-form.component.scss']
})
export class FacilityFormComponent implements OnInit, OnDestroy {
  private alive = true;

  public loading = true;
  public saving = false;
  public isNewFacility = true;
  public types = Constants.FacilityTypesList;

  public facility = null;
  public park = null;


  public facilityForm = new FormGroup({
    name: new FormControl('', Validators.required),
    status: new FormControl(false),
    stateReason: new FormControl(''),
    visible: new FormControl(false),
    type: new FormControl('', Validators.required),
    availabilityAM: new FormControl(false),
    availabilityPM: new FormControl(false),
    availabilityDAY: new FormControl(false),
    capacityAM: new FormControl(),
    capacityPM: new FormControl(),
    capacityDAY: new FormControl()
  });

  constructor(
    private _changeDetectionRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private facilityService: FacilityService,
    private parkService: ParkService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.isNewFacility = this.route.snapshot.data.component === 'add' || this.route.snapshot.data.component === 'addFacility';
    if (!this.isNewFacility) {
      this.facilityService.getItemValue()
        .pipe(takeWhile(() => this.alive))
        .subscribe((res) => {
          if (res) {
            this.facility = res;
            this.populateParkDetails();
            this.loading = false;
            this._changeDetectionRef.detectChanges();
          }
        });
      this.facilityForm.get('name').disable();
    } else {
      this.facilityForm.get('capacityAM').disable();
      this.facilityForm.get('capacityPM').disable();
      this.facilityForm.get('capacityDAY').disable();
      this.loading = false;
    }

    this.parkService.getItemValue()
      .pipe(takeWhile(() => this.alive))
      .subscribe((res) => {
        if (res) {
          this.park = res;
        }
      });

    this.facilityForm.controls['availabilityAM'].valueChanges.subscribe(data => {
      if (data) {
        this.facilityForm.get('capacityAM').enable();
        this.facilityForm.controls['capacityAM'].setValidators([Validators.required]);
      } else {
        this.facilityForm.get('capacityAM').setValue(null);
        this.facilityForm.get('capacityAM').disable();
        this.facilityForm.controls['capacityAM'].setValidators([]);
      }
      this.facilityForm.controls['capacityAM'].updateValueAndValidity();
    });

    this.facilityForm.controls['availabilityPM'].valueChanges.subscribe(data => {
      if (data) {
        this.facilityForm.get('capacityPM').enable();
        this.facilityForm.controls['capacityPM'].setValidators([Validators.required]);
      } else {
        this.facilityForm.get('capacityPM').setValue(null);
        this.facilityForm.get('capacityPM').disable();
        this.facilityForm.controls['capacityPM'].setValidators([]);
      }
      this.facilityForm.controls['capacityPM'].updateValueAndValidity();
    });

    this.facilityForm.controls['availabilityDAY'].valueChanges.subscribe(data => {
      if (data) {
        this.facilityForm.get('capacityDAY').enable();
        this.facilityForm.controls['capacityDAY'].setValidators([Validators.required]);
      } else {
        this.facilityForm.get('capacityDAY').setValue(null);
        this.facilityForm.get('capacityDAY').disable();
        this.facilityForm.controls['capacityDAY'].setValidators([]);
      }
      this.facilityForm.controls['capacityDAY'].updateValueAndValidity();
    });

    this.facilityForm.controls['status'].valueChanges.subscribe(data => {
      if (!data) {
        this.facilityForm.get('stateReason').enable();
      } else {
        this.facilityForm.get('stateReason').setValue(null);
        this.facilityForm.get('stateReason').disable();
      }
    });

    this.facilityForm.setErrors({ availibilityRequired: true });
    this.facilityForm.valueChanges.subscribe((data) => {
      if (data.availabilityAM === true || data.availabilityPM === true || data.availabilityDAY === true) {
        this.facilityForm.setErrors(null);
      } else {
        this.facilityForm.setErrors({ availibilityRequired: true });
      }
    });
  }

  populateParkDetails() {
    this.facilityForm.setValue({
      name: this.facility.name,
      status: this.facility.status.state === 'open' ? true : false,
      stateReason: this.facility.status.stateReason,
      visible: this.facility.visible,
      type: this.facility.type,
      availabilityAM: false,
      capacityAM: null,
      availabilityPM: false,
      capacityPM: null,
      availabilityDAY: false,
      capacityDAY: null
    });

    if (this.facilityForm.get('status')) {
      this.facilityForm.get('stateReason').disable();
    } else {
      this.facilityForm.get('stateReason').enable();
    }

    if (this.facility.bookingTimes && this.facility.bookingTimes.AM) {
      this.facilityForm.get('availabilityAM').setValue(true);
      this.facilityForm.get('capacityAM').setValue(this.facility.bookingTimes.AM.max);
    } else {
      this.facilityForm.get('availabilityAM').setValue(false);
      this.facilityForm.get('capacityAM').setValue(null);
    }
    if (this.facility.bookingTimes && this.facility.bookingTimes.PM) {
      this.facilityForm.get('availabilityPM').setValue(true);
      this.facilityForm.get('capacityPM').setValue(this.facility.bookingTimes.PM.max);
    } else {
      this.facilityForm.get('availabilityPM').setValue(false);
      this.facilityForm.get('capacityPM').setValue(null);
    }
    if (this.facility.bookingTimes && this.facility.bookingTimes.DAY) {
      this.facilityForm.get('availabilityDAY').setValue(true);
      this.facilityForm.get('capacityDAY').setValue(this.facility.bookingTimes.DAY.max);
    } else {
      this.facilityForm.get('availabilityDAY').setValue(false);
      this.facilityForm.get('capacityDAY').setValue(null);
    }
  }

  getInfoString(info) {
    switch (info) {
      case 'status':
        return this.facilityForm.get('status').value ? 'Open' : 'Closed';
      case 'visible':
        return this.facilityForm.get('visible').value ? 'Visible to public' : 'Not visible to public';
      case 'availability':
        let a = [];
        if (this.facilityForm.get('availabilityAM').value) {
          a.push(' AM ');
        }
        if (this.facilityForm.get('availabilityPM').value) {
          a.push(' PM ');
        }
        if (this.facilityForm.get('availabilityDAY').value) {
          a.push(' All Day ');
        }
        return a.join('/');
    }
  }

  submitForm() {
    let message = `<strong>Name:</strong></br>` + this.facilityForm.get('name').value;
    message += `</br><strong>Status:</strong></br>` + this.getInfoString('status');
    if (this.facilityForm.get('stateReason').value) {
      message += `</br><strong>Closure reason:</strong></br>` + this.facilityForm.get('stateReason').value;
    }
    message += `</br><strong>visible:</strong></br>` + this.getInfoString('visible');
    message += `</br><strong>Type:</strong></br>` + this.facilityForm.get('type').value;
    if (this.facilityForm.get('availabilityAM').value) {
      message += `</br><strong>AM Capacity:</strong></br>` + this.facilityForm.get('capacityAM').value;
    }
    if (this.facilityForm.get('availabilityPM').value) {
      message += `</br><strong>PM Capacity:</strong></br>` + this.facilityForm.get('capacityPM').value;
    }
    if (this.facilityForm.get('availabilityDAY').value) {
      message += `</br><strong>All Day Capacity:</strong></br>` + this.facilityForm.get('capacityDAY').value;
    }

    this.dialogService
      .addDialog(
        ConfirmComponent,
        {
          title: 'Confirm facility details:',
          message,
          okOnly: false
        },
        { backdropColor: 'rgba(0, 0, 0, 0.5)' }
      ).subscribe(async result => {
        this.saving = true;
        if (result) {
          if (this.isNewFacility) {
            // Post
            let postObj = new PostFacility();
            this.validateFields(postObj);
            await this.facilityService.createFacility(postObj, this.park.sk);
            this.toastService.addMessage('Faciltiy successfully created.', 'Add Faciltiy', Constants.ToastTypes.SUCCESS);
            this.facilityService.fetchData(null, this.park.sk);
          } else {
            // Put
            let putObj = new PutFacility();
            putObj.pk = this.facility.pk;
            putObj.sk = this.facility.sk;
            putObj.bookingTimes['reservations'] = this.facility.bookingTimes.reservations;
            this.validateFields(putObj);

            // Dont allow name change on edit.
            putObj.name = this.facility.name;
            await this.facilityService.editFacility(putObj, this.park.sk);
            this.toastService.addMessage('Facility successfully edited.', 'Edit Facility', Constants.ToastTypes.SUCCESS);
            this.facilityService.fetchData(this.facility.sk, this.park.sk);
          }
          this.router.navigate(['../details'], { relativeTo: this.route });
        }
        this.saving = false;
      });
  }

  private validateFields(obj) {
    // Manditory fields
    obj.name = this.facilityForm.get('name').value;
    if (this.facilityForm.get('status').value) {
      obj.status.state = 'open';
    } else {
      obj.status.state = 'closed';
    }
    obj.status.stateReason = this.facilityForm.get('stateReason').value;
    obj.visible = this.facilityForm.get('visible').value;
    obj.type = this.facilityForm.get('type').value;

    // Booking times
    let bookingObj = {};
    if (this.facilityForm.get('availabilityAM').value) {
      bookingObj['AM'] = {
        currentCount: 0,
        max: this.facilityForm.get('capacityAM').value
      };
    }
    if (this.facilityForm.get('availabilityPM').value) {
      bookingObj['PM'] = {
        currentCount: 0,
        max: this.facilityForm.get('capacityPM').value
      };
    }
    if (this.facilityForm.get('availabilityDAY').value) {
      bookingObj['DAY'] = {
        currentCount: 0,
        max: this.facilityForm.get('capacityDAY').value
      };
    }
    obj.bookingTimes = bookingObj;
  }

  cancel() {
    this.facilityForm.reset();
    this.router.navigate(['../details'], { relativeTo: this.route });
  }

  delete() {
    const message = `Are you sure you want to delete ${this.facility.name}?
    All passes within ${this.facility.name}
    will also be permanently deleted. This action cannot be undone.`;
    this.dialogService
      .addDialog(
        ConfirmComponent,
        {
          title: 'Confirm delete',
          message,
          okOnly: false
        },
        { backdropColor: 'rgba(0, 0, 0, 0.5)' }
      ).subscribe(result => {
        if (result) {
          this.router.navigate(['../'], { relativeTo: this.route });
        }
      });
  }

  resetForm() {
    if (this.isNewFacility) {
      this.facilityForm.reset();
    } else {
      this.populateParkDetails();
    }
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
