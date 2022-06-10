import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmComponent } from 'app/confirm/confirm.component';
import { Park } from 'app/models/park';
import { ParkService } from 'app/services/park.service';
import { ToastService } from 'app/services/toast.service';
import { Constants } from 'app/shared/utils/constants';
import { DialogService } from 'ng2-bootstrap-modal';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-park-form',
  templateUrl: './park-form.component.html',
  styleUrls: ['./park-form.component.scss']
})
export class ParkFormComponent implements OnInit, OnDestroy {
  private alive = true;

  public isNewPark = true;
  public loading = true;
  public saving = false;

  public park = null;

  public parkForm = new FormGroup({
    name: new FormControl('', Validators.required),
    orcs: new FormControl('', Validators.required),
    capacity: new FormControl(''),
    description: new FormControl('', [Validators.required]),
    status: new FormControl(false),
    visible: new FormControl(false),
    bcParksLink: new FormControl('', Validators.required),
    mapLink: new FormControl('')
  });

  constructor(
    private _changeDetectionRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private parkService: ParkService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.isNewPark = this.route.snapshot.data.component === 'add';
    if (!this.isNewPark) {
      this.parkService
        .getItemValue()
        .pipe(takeWhile(() => this.alive))
        .subscribe(res => {
          if (res) {
            this.park = res;
            this.populateParkDetails();
            this.loading = false;
            this._changeDetectionRef.detectChanges();
          }
        });
    } else {
      this.loading = false;
    }
  }

  populateParkDetails() {
    this.parkForm.setValue({
      name: this.park.name,
      orcs: this.park.sk,
      capacity: this.park.capacity ? this.park.capacity : null,
      description: this.park.description,
      status: this.park.status === 'open' ? true : false,
      visible: this.park.visible,
      bcParksLink: this.park.bcParksLink ? this.park.bcParksLink : '',
      mapLink: this.park.mapLink ? this.park.mapLink : ''
    });
    if (!this.isNewPark) {
      this.parkForm.get('name').disable();
    }
  }

  getParkInfoString(info) {
    switch (info) {
      case 'status':
        return this.parkForm.get('status').value ? 'Open' : 'Closed';
      case 'visible':
        return this.parkForm.get('visible').value ? 'Visible to public' : 'Not visible to public';
      case 'passRequired':
        return this.parkForm.get('parkPassRequired').value ? 'Passes required' : 'Passes not required';
    }
  }

  async submitForm() {
    const message =
      `<strong>Name:</strong></br>` +
      this.parkForm.get('name').value +
      `</br></br><strong>Status:</strong></br>` +
      this.getParkInfoString('status') +
      `</br></br><strong>Visibility:</strong></br>` +
      this.getParkInfoString('visible') +
      `</br></br><strong>Capacity:</strong></br>` +
      this.parkForm.get('capacity').value +
      `</br></br><strong>Link to BC Parks Site:</strong></br>` +
      this.parkForm.get('bcParksLink').value +
      `</br></br><strong>Description:</strong></br>` +
      this.parkForm.get('description').value +
      `</br></br><strong>Link to map:</strong></br>` +
      this.parkForm.get('mapLink').value;

    this.dialogService
      .addDialog(
        ConfirmComponent,
        {
          title: 'Confirm park details:',
          message,
          okOnly: false
        },
        { backdropColor: 'rgba(0, 0, 0, 0.5)' }
      )
      .subscribe(async result => {
        this.saving = true;
        if (result) {
          if (this.isNewPark) {
            // Post
            const postObj = new Park();
            this.validateFields(postObj);
            await this.parkService.createPark(postObj);
            this.toastService.addMessage('Park successfully created.', 'Add Park', Constants.ToastTypes.SUCCESS);
            this.parkService.fetchData();
          } else {
            // Put
            let putObj = new Park();
            putObj.pk = this.park.pk;
            putObj.sk = this.park.sk;
            this.validateFields(putObj);

            // Dont allow name change on edit.
            putObj.name = this.park.name;

            await this.parkService.editPark(putObj);
            this.toastService.addMessage('Park successfully edited.', 'Edit Park', Constants.ToastTypes.SUCCESS);
            this.parkService.fetchData(this.park.sk);
          }
          this.router.navigate(['parks']);
        }
        this.saving = false;
      });
  }

  private validateFields(obj) {
    // Manditory fields
    obj.orcs = this.parkForm.get('orcs').value;
    obj.name = this.parkForm.get('name').value;
    if (this.parkForm.get('status').value) {
      obj.status = 'open';
    } else {
      obj.status = 'closed';
    }
    obj.visible = this.parkForm.get('visible').value;
    obj.description = this.parkForm.get('description').value;

    // Optional
    if (this.parkForm.get('bcParksLink').value) {
      obj.bcParksLink = this.parkForm.get('bcParksLink').value;
    } else {
      delete obj.bcParksLink;
    }
    if (this.parkForm.get('capacity').value) {
      obj.capacity = this.parkForm.get('capacity').value;
    } else {
      delete obj.capacity;
    }
    if (this.parkForm.get('mapLink').value) {
      obj.mapLink = this.parkForm.get('mapLink').value;
    } else {
      obj.mapLink = '';
    }
  }

  testLink() {
    window.open(this.parkForm.get('bcParksLink').value);
  }

  testMapLink() {
    window.open(this.parkForm.get('mapLink').value);
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
      )
      .subscribe(result => {
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

  ngOnDestroy() {
    this.alive = false;
  }
}
