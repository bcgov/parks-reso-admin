import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ConfirmComponent } from 'app/confirm/confirm.component';
import { DialogService } from 'ng2-bootstrap-modal';
import { Constants } from '../shared/utils/constants';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-facility-form',
  templateUrl: './facility-form.component.html',
  styleUrls: ['./facility-form.component.scss']
})
export class FacilityFormComponent implements OnInit {
  public isNewFacility = true;
  public descriptionCharacterLimit = 500;
  public notificationCharacterLimit = 100;
  public types = Constants.FacilityTypesList;

  public mockFacilityObject = {
    name: 'Trailhead A',
    description: 'Walk here and you will see some nice trees, some rocks, and maybe if you are super lucky, you will see a frog or six',
    notification: 'Due to astronomical frog levels, this park is closed until further notice.',
    status: true,
    visibility: false,
    type: Constants.FacilityTypesList[0],
    capacity: 150,
    availability: true
  };

  public facilityForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.maxLength(this.descriptionCharacterLimit)),
    notification: new FormControl('', Validators.maxLength(this.notificationCharacterLimit)),
    status: new FormControl(false),
    visibility: new FormControl(false),
    type: new FormControl('', Validators.required),
    capacity: new FormControl('', Validators.required),
    availability: new FormControl(true),
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    this.isNewFacility = this.route.snapshot.data.component === 'add';
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isNewFacility = this.route.snapshot.data.component === 'add';
      });
  }

  checkNumber(e): boolean {
    const character = (e.which) ? e.which : e.keyCode;
    if (character > 31 && (character < 48 || character > 57)) {
      return false;
    } else {
      return true;
    }
  }

  populateParkDetails() {
    this.facilityForm.setValue({
      name: this.mockFacilityObject.name,
      description: this.mockFacilityObject.description,
      notification: this.mockFacilityObject.notification,
      status: this.mockFacilityObject.status,
      visibility: this.mockFacilityObject.visibility,
      type: this.mockFacilityObject.type,
      capacity: this.mockFacilityObject.capacity,
      availability: this.mockFacilityObject.availability
    });
  }

  // toggleAddEdit() {
  //   this.isNewFacility = !this.isNewFacility;
  //   this.resetForm();
  // }

  getInfoString(info) {
    switch (info) {
      case 'status':
        return this.facilityForm.get('status').value ? 'Open' : 'Closed';
      case 'visibility':
        return this.facilityForm.get('visibility').value ? 'Visible to public' : 'Not visible to public';
      case 'availability':
        let a = [];
        if (this.facilityForm.get('availabilityAM').value) {
          a.push(' AM ');
        }
        if (this.facilityForm.get('availabilityPM').value) {
          a.push(' PM ');
        }
        if (this.facilityForm.get('availabilityAllDay').value) {
          a.push(' All Day ');
        }
        return a.join('/');
    }
  }

  submitForm() {
    const message = `<strong>Name: </strong>` + this.facilityForm.get('name').value +
      `</br><strong>Description: </strong>` + this.facilityForm.get('description').value +
      `</br><strong>Notification: </strong>` + this.facilityForm.get('notification').value +
      `</br><strong>Status: </strong>` + this.getInfoString('status') +
      `</br><strong>Type: </strong>` + this.facilityForm.get('type').value +
      `</br><strong>Capacity: </strong>` + this.facilityForm.get('capacity').value +
      `</br><strong>Availability: </strong>` + this.getInfoString('availability') +
      `</br><strong>Visibility: </strong>` + this.getInfoString('visibility');

    this.dialogService
      .addDialog(
        ConfirmComponent,
        {
          title: 'Confirm facility details:',
          message,
          okOnly: false
        },
        { backdropColor: 'rgba(0, 0, 0, 0.5)' }
      ).subscribe(result => {
        if (result) {
          this.router.navigate(['../details'], { relativeTo: this.route });
        }
      });
  }

  cancel() {
    this.facilityForm.reset();
    this.router.navigate(['../details'], { relativeTo: this.route });
  }

  delete() {
    const message = `Are you sure you want to delete ${this.mockFacilityObject.name}?
    All passes within ${this.mockFacilityObject.name}
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
          this.router.navigate(['parks']);
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





}
