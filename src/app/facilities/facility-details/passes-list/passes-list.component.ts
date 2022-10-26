import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { PassService } from 'src/app/services/pass.service';
import { TableButtonComponent } from 'src/app/shared/components/table/table-components/table-button/table-button.component';
import { tableSchema } from 'src/app/shared/components/table/table.component';
import { Constants } from 'src/app/shared/utils/constants';

@Component({
  selector: 'app-passes-list',
  templateUrl: './passes-list.component.html',
  styleUrls: ['./passes-list.component.scss'],
})
export class PassesListComponent implements OnInit {
  private subscriptions = new Subscription();
  public tableSchema: tableSchema;
  public tableRows: any[] = [];

  constructor(
    protected dataService: DataService,
    protected passService: PassService
  ) {
    this.subscriptions.add(
      dataService
        .getItemValue(Constants.dataIds.PASSES_LIST)
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

  displayPassModal() {
    // TODO
    console.log('display pass modal');
  }

  createTable() {
    this.tableSchema = {
      id: 'passes-list',
      rowClick: (row) => {
        const self = this;
        return function () {
          self.displayPassModal();
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
          displayHeader: '',
          columnClasses: 'ps-5 pe-3',
          width: '10%',
          mapValue: () => null,
          cellTemplate: (passObj) => {
            const self = this;
            return {
              component: TableButtonComponent,
              inputs: {
                buttonClass: 'btn btn-outline-danger',
                iconClass: 'bi bi-x-circle-fill',
                isDisabled: this.disableCancelButton(passObj),
                onClick: function () {
                  self.cancelPass(passObj);
                },
              },
            };
          },
        },
      ],
    };
  }
}
