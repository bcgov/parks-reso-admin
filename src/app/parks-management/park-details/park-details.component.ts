import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { Constants } from 'src/app/shared/utils/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { tableSchema } from 'src/app/shared/components/table/table.component';
import { TableButtonComponent } from 'src/app/shared/components/table/table-components/table-button/table-button.component';
import { KeycloakService } from 'src/app/services/keycloak.service';

@Component({
  selector: 'app-park-details',
  templateUrl: './park-details.component.html',
  styleUrls: ['./park-details.component.scss'],
})
export class ParkDetailsComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  public park;
  public tableSchema: tableSchema;
  public tableRows: any[] = [];
  public addFacilityButtonConfig;

  constructor(
    protected dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    protected keycloakService: KeycloakService
  ) {
    this.subscriptions.add(
      dataService.watchItem(Constants.dataIds.CURRENT_PARK).subscribe((res) => {
        if (res) {
          this.park = res;
        }
      })
    );
    this.subscriptions.add(
      dataService
        .watchItem(Constants.dataIds.FACILITIES_LIST)
        .subscribe((res) => {
          if (res) {
            this.tableRows = res;
          }
        })
    );
    if (this.keycloakService.isAllowed('add-facility')) {
      this.addFacilityButtonConfig = {
        active: true,
        text: 'Add Facility',
        nav: 'add-facility',
        hidden: false,
      };
    }
  }

  ngOnInit(): void {
    this.createTable();
  }

  navigate(nav, edit = false) {
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
          self.navigate(facilityObj.name);
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
                altText: 'Edit',
                buttonClass: 'btn btn-outline-primary',
                iconClass: 'bi bi-pencil-fill',
                onClick: function () {
                  self.navigate(facilityObj.name, true);
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
