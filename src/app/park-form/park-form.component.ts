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

  public mockParkObject = {
    parkName: 'Goldstream Provincial Park',
    parkDescription: 'Massive trees, majestic waterfalls, a meandering river that meets the sea, flowers, birds and fascinating fish are but a few of the attractions that draw people to Goldstream Provincial Park, a mere 16 km from downtown Victoria on southern Vancouver Island.',
    parkStatus: true,
    parkVisibility: true,
  }

  public parkForm = new FormGroup({
    parkName: new FormControl('', Validators.required),
    parkDescription: new FormControl(''),
    parkStatus: new FormControl(false),
    parkVisibility: new FormControl(false)
  })

  constructor(
    private router: Router,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
  }

  populateParkDetails() {
    this.parkForm.setValue({
      parkName: this.mockParkObject.parkName,
      parkDescription: this.mockParkObject.parkDescription,
      parkStatus: this.mockParkObject.parkStatus,
      parkVisibility: this.mockParkObject.parkVisibility,
    })
  }

  toggleAddEdit() {
    this.isNewPark = !this.isNewPark;
    this.resetForm();
  }

  getParkStatusString(){
    return this.parkForm.get('parkStatus').value ? 'Open' : 'Closed';
  }

  getParkVisibilityString(){
    return this.parkForm.get('parkVisibility').value ? 'Visible to public' : 'Not visible to public';
  }

  submitForm() {
    const message = `<strong>Park Name: </strong>` + this.parkForm.get('parkName').value +
    `</br><strong>Park Description: </strong>` + this.parkForm.get('parkDescription').value +
    `</br><strong>Park Status: </strong>` + this.getParkStatusString() +
    `</br><strong>Park Visibility: </strong>` + this.getParkVisibilityString();

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
      })
  }

  cancel() {
    this.parkForm.reset();
    this.router.navigate(['parks']);
  }

  resetForm() {
    if (this.isNewPark) {
      this.parkForm.reset();
    } else {
      this.populateParkDetails();
    }
  }





}
