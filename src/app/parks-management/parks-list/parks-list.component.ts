import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { TableButtonComponent } from 'src/app/shared/components/table/table-components/table-button/table-button.component';
import { Constants } from 'src/app/shared/utils/constants';
import { tableSchema } from '../../shared/components/table/table.component';

@Component({
  selector: 'app-parks-list',
  templateUrl: './parks-list.component.html',
  styleUrls: ['./parks-list.component.scss'],
})
export class ParksListComponent implements OnInit, OnDestroy {
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
        .watchItem(Constants.dataIds.PARK_AND_FACILITY_LIST)
        .subscribe((res) => {
          if (res) {
            let tempArray = [];
            for (const park in res) {
              tempArray.push(res[park]);
            }
            this.tableRows = tempArray;
          }
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

  navToPark(nav, edit = false) {
    if (edit) {
      this.router.navigate([nav + '/edit'], { relativeTo: this.route });
    } else {
      this.router.navigate([nav], { relativeTo: this.route });
    }
  }

  createTable() {
    this.tableSchema = {
      id: 'parks-list',
      rowClick: (parkObj) => {
        let self = this;
        return function () {
          self.navToPark(parkObj.sk);
        };
      },
      columns: [
        {
          id: 'name',
          displayHeader: 'Name',
          columnClasses: 'ps-3 pe-5',
          mapValue: (parkObj) => parkObj.name,
        },
        {
          id: 'status',
          displayHeader: 'Status',
          columnClasses: 'px-5',
          width: '50%',
          mapValue: (parkObj) => parkObj.status,
          mapDisplay: (parkObj) => this.getParkStatus(parkObj.status),
        },
        {
          id: 'edit-button',
          displayHeader: 'Actions',
          width: '10%',
          columnClasses: 'ps-5 pe-3',
          mapValue: () => null,
          cellTemplate: (parkObj) => {
            const self = this;
            return {
              component: TableButtonComponent,
              inputs: {
                altText: 'Edit',
                buttonClass: 'btn btn-outline-primary',
                iconClass: 'bi bi-pencil-fill',
                onClick: function () {
                  self.navToPark(parkObj.sk, true);
                },
              },
            };
          },
        },
      ],
    };
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
