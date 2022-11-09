import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { PassService } from 'src/app/services/pass.service';
import { TableButtonComponent } from 'src/app/shared/components/table/table-components/table-button/table-button.component';
import { tableSchema } from 'src/app/shared/components/table/table.component';
import { Constants } from 'src/app/shared/utils/constants';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { modalSchema } from 'src/app/shared/components/modal/modal.component';

@Component({
  selector: 'app-passes-list',
  templateUrl: './passes-list.component.html',
  styleUrls: ['./passes-list.component.scss'],
})
export class PassesListComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  public tableSchema: tableSchema;
  public tableRows: any[] = [];
  public passModal: modalSchema;
  public cancelModal: modalSchema;
  public passModalRef: BsModalRef;
  public cancelModalRef: BsModalRef;

  @ViewChild('passModalTemplate') passModalTemplate: TemplateRef<any>;
  @ViewChild('cancelModalTemplate') cancelModalTemplate: TemplateRef<any>;

  constructor(
    protected dataService: DataService,
    protected passService: PassService,
    protected modalService: BsModalService,
    protected vcr: ViewContainerRef
  ) {
    this.subscriptions.add(
      dataService
        .watchItem(Constants.dataIds.PASSES_LIST)
        .subscribe((res) => {
          this.tableRows = res;
        })
    );
  }

  ngOnInit(): void {
    this.createTable();
  }

  cancelPass(pass) {
    const parkSk = pass.pk.split('::')[1];
    this.passService.cancelPasses(pass.sk, parkSk);
  }

  disableCancelButton(pass) {
    if (pass.passStatus === 'cancelled' || pass.passStatus === 'expired') {
      return true;
    }
    return false;
  }

  displayPassModal(passObj) {
    const self = this;
    this.passModal = {
      id: 'passModal',
      title: 'Pass Information',
      body: this.constructPassModalBody(passObj),
      buttons: [
        {
          text: 'Ok',
          classes: 'btn btn-primary',
          onClick: function () {
            self.passModalRef.hide();
          },
        },
      ],
    };
    this.passModalRef = this.modalService.show(this.passModalTemplate, { class: 'modal-lg' });
  }

  constructPassModalBody(passObj) {
    let message = `<strong>First Name:</strong></br>` + passObj.firstName;
    message += `</br></br><strong>Last Name:</strong></br>` + passObj.lastName;
    message += `</br></br><strong>Email:</strong></br>` + passObj.email;
    if (passObj.phoneNumber) {
      message +=
        `</br></br><strong>Phone Number:</strong></br>` + passObj.phoneNumber;
    }
    if (passObj.facilityType === 'Parking') {
      message +=
        `</br></br><strong>License Plate:</strong></br>` + passObj.license;
    }
    message +=
      `<hr><strong>Registration Number:</strong></br>` +
      passObj.registrationNumber;
    message +=
      `</br></br><strong>Facility Name:</strong></br>` + passObj.facilityName;
    message += `</br></br><strong>Booking Time:</strong></br>` + passObj.type;
    message += `</br></br><strong>Date:</strong></br>` + passObj.date;
    message +=
      `</br></br><strong>Pass Status:</strong></br>` + passObj.passStatus;
    return message;
  }

  displayCancelModal(passObj) {
    const self = this;
    this.cancelModal = {
      id: 'cancelModal',
      title: 'Cancel Pass',
      body: this.constructCancelPassModal(passObj),
      buttons: [
        {
          text: 'Cancel Pass',
          classes: 'btn btn-danger',
          onClick: function () {
            self.cancelPass(passObj);
            self.cancelModalRef.hide();
          },
        },
      ]
    };
    this.cancelModalRef = this.modalService.show(this.cancelModalTemplate, { class: 'modal-lg' });
  }

  constructCancelPassModal(passObj) {
    let message = `<p>You are about to cancel pass <strong>${passObj.registrationNumber}</strong>.</div>`;
    message += `<p>Are you sure you want to continue?</p>`;
    return message;
  }

  createTable() {
    this.tableSchema = {
      id: 'passes-list',
      rowClick: (passObj) => {
        const self = this;
        return function () {
          self.displayPassModal(passObj);
        };
      },
      columns: [
        {
          id: 'passId',
          displayHeader: 'Reg #',
          columnClasses: 'ps-3 pe-3',
          mapValue: (passObj) => passObj.sk,
        },
        {
          id: 'email',
          displayHeader: 'Email',
          columnClasses: 'px-3',
          mapValue: (passObj) => passObj.email,
        },
        {
          id: 'numberOfGuests',
          displayHeader: 'Guests',
          columnClasses: 'px-3',
          mapValue: (passObj) => passObj.numberOfGuests,
        },
        {
          id: 'date',
          displayHeader: 'Date',
          columnClasses: 'px-3',
          mapValue: (passObj) => passObj.shortPassDate,
        },
        {
          id: 'status',
          displayHeader: 'Status',
          columnClasses: 'px-3',
          mapValue: (passObj) => passObj.passStatus,
        },
        {
          id: 'cancel-button',
          displayHeader: 'Actions',
          columnClasses: 'ps-5 pe-3',
          width: '10%',
          mapValue: () => null,
          cellTemplate: (passObj) => {
            const self = this;
            return {
              component: TableButtonComponent,
              inputs: {
                altText: 'Cancel',
                buttonClass: 'btn btn-outline-danger',
                iconClass: 'bi bi-x-circle-fill',
                isDisabled: this.disableCancelButton(passObj),
                onClick: function () {
                  self.displayCancelModal(passObj);
                },
              },
            };
          },
        },
      ],
    };
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
