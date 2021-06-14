import { Component, OnInit } from '@angular/core';
import { ConfirmComponent } from 'app/confirm/confirm.component';
import { PassService } from 'app/services/pass.service';
import { TableRowComponent } from 'app/shared/components/table-template/table-row-component';
import { DialogService } from 'ng2-bootstrap-modal';

@Component({
  selector: 'tr[app-pass-table-row]',
  templateUrl: './pass-table-row.component.html',
  styleUrls: ['./pass-table-row.component.scss']
})
export class PassTableRowComponent extends TableRowComponent implements OnInit {

  constructor(
    private dialogService: DialogService,
    private passService: PassService
  ) {
    super();
  }

  ngOnInit() { }

  validate(value) {
    if (this.rowData && this.rowData.hasOwnProperty(value)) {
      return this.rowData[value];
    } else {
      return '-';
    }
  }

  navigate(route) {
    switch (route) {
      case 'details':
        let message = `<strong>First Name:</strong></br>` + this.rowData.firstName;
        message += `</br></br><strong>Last Name:</strong></br>` + this.rowData.lastName;
        message += `</br></br><strong>Email:</strong></br>` + this.rowData.email;
        if (this.rowData.phoneNumber) {
          message += `</br></br><strong>Phone Number:</strong></br>` + this.rowData.phoneNumber;
        }
        if (this.rowData.facilityType === 'Parking') {
          message += `</br></br><strong>License Plate:</strong></br>` + this.rowData.license;
        }
        message += `<hr><strong>Registration Number:</strong></br>` + this.rowData.registrationNumber;
        message += `</br></br><strong>Facility Name:</strong></br>` + this.rowData.facilityName;
        message += `</br></br><strong>Booking Time:</strong></br>` + this.rowData.type;
        message += `</br></br><strong>Date:</strong></br>` + this.rowData.date;
        message += `</br></br><strong>Pass Status:</strong></br>` + this.rowData.passStatus;

        this.dialogService
          .addDialog(
            ConfirmComponent,
            {
              title: 'Details for ' + this.rowData.registrationNumber,
              message,
              okOnly: true
            },
            { backdropColor: 'rgba(0, 0, 0, 0.5)' }
          );
        break;
      case 'cancel':
        let cancelMessage = `<p>You are about to cancel pass <strong>${this.rowData.registrationNumber}</strong>.</div>`;
        cancelMessage += `<p>Are you sure you want to continue?</p>`;
        this.dialogService
          .addDialog(
            ConfirmComponent,
            {
              title: 'Cancelling ' + this.rowData.registrationNumber,
              message: cancelMessage,
              okOnly: false
            },
            { backdropColor: 'rgba(0, 0, 0, 0.5)' }
          ).subscribe(async result => {
            if (result) {
              // TODO: create toast if this blows up.
              await this.passService.cancelPass(this.rowData.sk, this.rowData.pk.replace('pass::', ''));
              this.rowData.passStatus = 'cancelled';
            }
          });
        break;
      default:
        break;
    }
  }
}
