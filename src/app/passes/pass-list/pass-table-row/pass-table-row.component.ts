import { Component, OnInit } from '@angular/core';
import { ConfirmComponent } from 'app/confirm/confirm.component';
import { PassService } from 'app/services/pass.service';
import { ReservationService } from 'app/services/reservation.service';
import { ToastService } from 'app/services/toast.service';
import { TableRowComponent } from 'app/shared/components/table-template/table-row-component';
import { Constants } from 'app/shared/utils/constants';
import { DialogService } from 'ng2-bootstrap-modal';

@Component({
  selector: 'tr[app-pass-table-row]',
  templateUrl: './pass-table-row.component.html',
  styleUrls: ['./pass-table-row.component.scss']
})
export class PassTableRowComponent extends TableRowComponent implements OnInit {
  public cancelLoading = false;

  constructor(
    private dialogService: DialogService,
    private passService: PassService,
    private toastService: ToastService,
    private reservationService: ReservationService
  ) {
    super();
  }

  ngOnInit() {}

  validate(value) {
    if (this.rowData && this.rowData.hasOwnProperty(value)) {
      if (value === 'date') {
        const tempDate = new Date(this.rowData[value]).toISOString().slice(0, 10);
        return tempDate;
      } else {
        return this.rowData[value];
      }
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

        this.dialogService.addDialog(
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
          )
          .subscribe(async result => {
            if (result) {
              this.cancelLoading = true;
              try {
                await this.passService.cancelPass(this.rowData.sk, this.rowData.pk.replace('pass::', ''));
                let reservationObj = null;

                this.reservationService
                  .getItemValue()
                  .subscribe(event => (reservationObj = event))
                  .unsubscribe();
                if (reservationObj) {
                  reservationObj.capacities[this.rowData.type].availablePasses =
                    reservationObj.capacities[this.rowData.type].availablePasses + this.rowData.numberOfGuests;
                  this.reservationService.setItemValue(reservationObj);
                }
                this.toastService.addMessage(
                  'Pass cancelled successfully.',
                  'Cancel Pass',
                  Constants.ToastTypes.SUCCESS
                );
                this.rowData.passStatus = 'cancelled';
              } catch (error) {
                console.log(error);
                this.toastService.addMessage(
                  'Pass failed to cancel. Please refresh the page and try again.',
                  'Cancel Pass',
                  Constants.ToastTypes.ERROR
                );
              }

              this.cancelLoading = false;
            }
          });
        break;
      default:
        break;
    }
  }
}
