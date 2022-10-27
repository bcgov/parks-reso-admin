import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { TableButtonComponent } from 'src/app/shared/components/table/table-components/table-button/table-button.component';
import { tableSchema } from 'src/app/shared/components/table/table.component';
import { Constants } from 'src/app/shared/utils/constants';

@Component({
  selector: 'app-facilities-list',
  templateUrl: './facilities-list.component.html',
  styleUrls: ['./facilities-list.component.scss'],
})
export class FacilitiesListComponent implements OnInit, OnDestroy {
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
        .watchItem(Constants.dataIds.FACILITIES_LIST)
        .subscribe((res) => {
          this.tableRows = res;
        })
    );
  }

  ngOnInit(): void {
    this.createTable();
  }

  navToFacility(nav, edit = false) {
    if (edit) {
      this.router.navigate([nav + '/edit'], { relativeTo: this.route });
    } else {
      this.router.navigate([nav], { relativeTo: this.route });
    }
  }

  createTable() {
    this.tableSchema = {
      id: 'facilities-list',
      rowClick: (facilityObj) => {
        let self = this;
        return function () {
          self.navToFacility(facilityObj.name);
        };
      },
      columns: [
        {
          id: 'name',
          displayHeader: 'Name',
          columnClasses: 'ps-3 pe-5',
          mapValue: (facilityObj) => facilityObj.name,
        },
        {
          id: 'type',
          displayHeader: 'Type',
          columnClasses: 'px-5',
          mapValue: (facilityObj) => facilityObj.type,
        },
        {
          id: 'status',
          displayHeader: 'Status',
          columnClasses: 'px-5',
          mapValue: (facilityObj) => facilityObj.status?.state,
        },
        {
          id: 'visible',
          displayHeader: 'Visible',
          columnClasses: 'px-5',
          mapValue: (facilityObj) => facilityObj.visible,
        },
        {
          id: 'facility-edit',
          displayHeader: '',
          width: '10%',
          columnClasses: 'ps-5 pe-3',
          mapValue: () => null,
          cellTemplate: (facilityObj) => {
            const self = this;
            return {
              component: TableButtonComponent,
              inputs: {
                buttonClass: 'btn btn-outline-primary',
                iconClass: 'bi bi-pencil-fill',
                onClick: function () {
                  self.navToFacility(facilityObj.name, true);
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
