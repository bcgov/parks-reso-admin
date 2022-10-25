import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { TableEditButtonComponent } from 'src/app/shared/components/table/table-components/edit-button/edit-button.component';
import { Constants } from 'src/app/shared/utils/constants';
import { tableSchema } from '../../shared/components/table/table.component';

@Component({
  selector: 'app-parks-list',
  templateUrl: './parks-list.component.html',
  styleUrls: ['./parks-list.component.scss'],
})
export class ParksListComponent implements OnInit {
  private subscriptions = new Subscription();
  public tableSchema: tableSchema;
  public tableRows: any[] = [];

  constructor(protected dataService: DataService, private router: Router) {
    this.subscriptions.add(
      dataService
        .getItemValue(Constants.dataIds.PARKS_LIST)
        .subscribe((res) => {
          this.tableRows = res;
        })
    );
  }

  ngOnInit(): void {
    this.createTable();
  }

  getParkStatus(status) {
    if (status === 'open') {
      return 'Passes Required';
    } else {
      return 'Passes Not Required';
    }
  }

  navToPark(nav) {
    // TODO: create url based on park payload
    this.router.navigate(['/parks/' + nav]);
  }

  createTable() {
    this.tableSchema = {
      id: 'parks-list',
      rowClick: (row) => {
        let self = this;
        return function () {
          self.navToPark(row.name);
        };
      },
      columns: [
        {
          id: 'name',
          displayHeader: 'Name',
          columnClasses: 'ps-3 pe-5',
          mapValue: (row) => row.name,
        },
        {
          id: 'status',
          displayHeader: 'Status',
          columnClasses: 'px-5',
          width: '50%',
          mapValue: (row) => row.status,
          mapDisplay: (row) => this.getParkStatus(row.status),
        },
        {
          id: 'edit-button',
          displayHeader: '',
          width: '10%',
          columnClasses: 'ps-5 pe-3',
          mapValue: () => null,
          cellTemplate: (row) => {
            return {
              component: TableEditButtonComponent,
              inputs: {
                route: '/parks/' + row.name + '/edit',
              },
            };
          },
        },
      ],
    };
  }
}
