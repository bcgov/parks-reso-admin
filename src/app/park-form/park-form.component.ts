import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmComponent } from 'app/confirm/confirm.component';
import { DialogService } from 'ng2-bootstrap-modal';

@Component({
  selector: 'app-park-form',
  templateUrl: './park-form.component.html',
  styleUrls: ['./park-form.component.scss']
})
export class ParkFormComponent implements OnInit {

  public isNewPark = true;
  public descriptionCharacterLimit = 500;

  public park = {
    name: 'Goldstream Provincial Park',
    description: 'Massive trees, majestic waterfalls, a meandering river that meets the sea, flowers, birds and fascinating fish are but a few of the attractions that draw people to Goldstream Provincial Park, a mere 16 km from downtown Victoria on southern Vancouver Island.',
    status: true,
    visibility: true,
    link: 'https://bcparks.ca/explore/parkpgs/goldstream/'
  };

  public parkForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.maxLength(this.descriptionCharacterLimit)),
    status: new FormControl(false),
    visibility: new FormControl(false),
    link: new FormControl('')
  });

  constructor(
    private router: Router,
    private dialogService: DialogService,
  ) { }

  ngOnInit() {
  }

  populateParkDetails() {
    this.parkForm.setValue({
      name: this.park.name,
      description: this.park.description,
      status: this.park.status,
      visibility: this.park.visibility,
      link: this.park.link
    });
  }

  toggleAddEdit() {
    this.isNewPark = !this.isNewPark;
    this.resetForm();
  }

  getParkInfoString(info) {
    switch (info) {
      case 'status':
        return this.parkForm.get('status').value ? 'Open' : 'Closed';
      case 'visibility':
        return this.parkForm.get('visibility').value ? 'Visible to public' : 'Not visible to public';
      case 'passRequired':
        return this.parkForm.get('parkPassRequired').value ? 'Passes required' : 'Passes not required';
    }
  }

  submitForm() {
    const message = `<strong>Park Name: </strong>` + this.parkForm.get('name').value +
      `</br><strong>Park Description: </strong>` + this.parkForm.get('description').value +
      `</br><strong>Park Status: </strong>` + this.getParkInfoString('status') +
      `</br><strong>Park Visibility: </strong>` + this.getParkInfoString('visibility');

    this.dialogService
      .addDialog(
        ConfirmComponent,
        {
          title: 'Confirm park details:',
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

  testLink() {
    window.open(this.parkForm.get('link').value);
  }

  cancel() {
    this.parkForm.reset();
    this.router.navigate(['parks']);
  }

  delete() {
    const message = `Are you sure you want to delete ${this.park.name}?
    All facilities within ${this.park.name}
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
    if (this.isNewPark) {
      this.parkForm.reset();
    } else {
      this.populateParkDetails();
    }
  }





}
