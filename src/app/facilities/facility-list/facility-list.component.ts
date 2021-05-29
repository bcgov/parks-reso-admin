import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IColumnObject, TableObject } from 'app/shared/components/table-template/table-object';
import { ITableMessage } from 'app/shared/components/table-template/table-row-component';
import { Constants } from 'app/shared/utils/constants';
import { FacilityTableRowComponent } from './facility-table-row/facility-table-row.component';

@Component({
  selector: 'app-facility-list',
  templateUrl: './facility-list.component.html',
  styleUrls: ['./facility-list.component.scss']
})
export class FacilityListComponent implements OnInit {
  // Component
  public loading = true;

  // Table
  public tableData: TableObject = new TableObject({ component: FacilityTableRowComponent });
  public tableColumns: IColumnObject[] = [
    {
      name: 'Name',
      value: 'name',
      width: 'col-3'
    },
    {
      name: 'Type',
      value: 'type',
      width: 'col-2'
    },
    {
      name: 'Time',
      value: 'time',
      width: 'col-2'
    },
    {
      name: 'Capacity',
      value: 'capacity',
      width: 'col-1'
    },
    {
      name: 'Status',
      value: 'status',
      width: 'col-2'
    },
    {
      name: 'Actions',
      value: '',
      width: 'col-2',
      nosort: true
    }
  ];

  constructor(
    private _changeDetectionRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // Get table controls from url and save them in the tableData

    // Get data from service
    this.tableData.totalListItems = 2;
    this.tableData.items = Constants.mockFacilityList;

    // Set columns
    this.tableData.columns = this.tableColumns;
    this._changeDetectionRef.detectChanges();
    this.loading = false;
  }

  onMessageOut(msg: ITableMessage) {
    let params = {};
    switch (msg.label) {
      case 'pageNum':
        params['currentPage'] = msg.data;
        // this.tableService.data[this.tableId].cachedConfig.currentPage = params['currentPage'];
        break;
      case 'pageSize':
        params['pageSize'] = msg.data.value;
        if (params['pageSize'] === this.tableData.totalListItems) {
          // this.loadingTableData = true;
        }
        params['currentPage'] = 1;
        // this.tableService.data[this.tableId].cachedConfig.pageSize = params['pageSize'];
        // this.tableService.data[this.tableId].cachedConfig.currentPage = params['currentPage'];
        break;
      default:
        break;
    }
    this.submit(params);
  }

  submit(params, filters = null) {
    console.log(params, filters);
    // this.router.navigate(
    //   [],
    //   {
    //     queryParams: filters ? { ...params, ...filters } : params,
    //     relativeTo: this.route,
    //     queryParamsHandling: 'merge'
    //   });
    // this.loadingTableData = true;
    // this.tableService.refreshData(this.tableId);
  }
}
