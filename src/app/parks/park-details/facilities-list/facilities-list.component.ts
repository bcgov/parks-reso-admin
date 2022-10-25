import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';
import { filter, pairwise, Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { TableEditButtonComponent } from 'src/app/shared/components/table/table-components/edit-button/edit-button.component';
import { tableSchema } from 'src/app/shared/components/table/table.component';
import { Constants } from 'src/app/shared/utils/constants';

@Component({
  selector: 'app-facilities-list',
  templateUrl: './facilities-list.component.html',
  styleUrls: ['./facilities-list.component.scss'],
})
export class FacilitiesListComponent implements OnInit {
  private subscriptions = new Subscription();
  public tableSchema: tableSchema;
  public tableRows: any[] = [];

  constructor(
    protected dataService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.subscriptions.add(
      dataService
        .getItemValue(Constants.dataIds.FACILITIES_LIST)
        .subscribe((res) => {
          this.tableRows = res;
        })
    );
  }

  ngOnInit(): void {
    this.createTable();
  }

  navToFacility(nav) {
    this.router.navigate([nav], { relativeTo: this.route });
  }

  createTable() {
    this.tableSchema = {
      id: 'facilities-list',
      rowClick: (row) => {
        let self = this;
        return function () {
          self.navToFacility(row.name);
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
          id: 'type',
          displayHeader: 'Type',
          columnClasses: 'px-5',
          mapValue: (row) => row.type,
        },
        {
          id: 'status',
          displayHeader: 'Status',
          columnClasses: 'px-5',
          mapValue: (row) => row.status?.state,
        },
        {
          id: 'visible',
          displayHeader: 'Visible',
          columnClasses: 'px-5',
          mapValue: (row) => row.visible,
        },
        {
          id: 'facility-edit',
          displayHeader: '',
          width: '10%',
          columnClasses: 'ps-5 pe-3',
          mapValue: () => null,
          cellTemplate: (row) => {
            return {
              component: TableEditButtonComponent,
              inputs: {
                route: this.router.url + '/' + row.name + '/edit',
              },
            };
          },
        },
      ],
    };
  }
}
