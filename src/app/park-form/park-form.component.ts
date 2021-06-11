import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmComponent } from 'app/confirm/confirm.component';
import { Park } from 'app/models/park';
import { ParkService } from 'app/services/park.service';
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
  public descriptionCharacterLimit = 500;
  public loading = true;

  public park = null;

  public parkForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', [
      Validators.maxLength(this.descriptionCharacterLimit),
      Validators.required
    ]),
    status: new FormControl(false),
    visible: new FormControl(false),
    bcParksLink: new FormControl('')
  });

  constructor(
    private _changeDetectionRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private parkService: ParkService
  ) { }

  ngOnInit() {
    this.isNewPark = this.route.snapshot.data.component === 'add';
    if (!this.isNewPark) {
      this.parkService.getItemValue()
        .pipe(takeWhile(() => this.alive))
        .subscribe((res) => {
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
      description: this.park.description,
      status: this.park.status === 'open' ? true : false,
      visible: this.park.visible,
      bcParksLink: this.park.bcParksLink
    });
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
    const message = `<strong>Park Name:</strong></br>` + this.parkForm.get('name').value +
      `</br></br><strong>Park Status:</strong></br>` + this.getParkInfoString('status') +
      `</br></br><strong>Park Visibility:</strong></br>` + this.getParkInfoString('visible') +
      `</br></br><strong>Link to BC Parks Site:</strong></br>` + this.parkForm.get('bcParksLink').value +
      `</br></br><strong>Park Description:</strong></br>` + this.parkForm.get('description').value;

    this.dialogService
      .addDialog(
        ConfirmComponent,
        {
          title: 'Confirm park details:',
          message,
          okOnly: false
        },
        { backdropColor: 'rgba(0, 0, 0, 0.5)' }
      ).subscribe(async result => {
        this.loading = true;
        if (result) {
          try {
            if (this.isNewPark) {
              // Post
              const postObj = new Park();
              this.validateFields(postObj);
              await this.parkService.createPark(postObj);
            } else {
              // Put
              const putObj = new Park();
              putObj.pk = this.park.pk;
              putObj.sk = this.park.sk;
              this.validateFields(putObj);
              await this.parkService.editPark(putObj);
            }
          } catch (error) {
            // TODO: Use toast service to make this look nicer.
            alert('An error as occured.');
          }
          this.loading = false;
          // TODO: Success toast.
          this.router.navigate(['parks']);
        }
      });
  }

  private validateFields(obj) {
    // Manditory fields
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
  }

  testLink() {
    window.open(this.parkForm.get('bcParksLink').value);
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

  ngOnDestroy() {
    this.alive = false;
  }
}
