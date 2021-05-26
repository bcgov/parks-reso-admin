import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IColumnObject, TableObject } from 'app/shared/components/table-template/table-object';
import { ITableMessage } from 'app/shared/components/table-template/table-row-component';
import { Constants } from 'app/shared/utils/constants';
import { ParksTableRowComponent } from './parks-table-row/parks-table-row.component';

@Component({
  selector: 'app-parks-list',
  templateUrl: './parks-list.component.html',
  styleUrls: ['./parks-list.component.scss']
})
export class ParksListComponent implements OnInit {
  // Table
  public tableData: TableObject = new TableObject({ component: ParksTableRowComponent });
  public tableColumns: IColumnObject[] = [
    {
      name: 'Name',
      value: 'name',
      width: 'col-4'
    },
    {
      name: 'Status',
      value: 'status',
      width: 'col-4'
    },
    {
      name: '',
      value: '',
      width: 'col-4',
      nosort: true
    },
  ];

  constructor(
    private _changeDetectionRef: ChangeDetectorRef
  ) { }

  ngOnInit() {

    // Get table controls from url and save them in the tableData

    // Get data from service
    this.tableData.totalListItems = 2;
    this.tableData.items = Constants.mockParkList.map(item => {
      return { rowData: item };
    });

    // Set columns
    this.tableData.columns = this.tableColumns;
    this._changeDetectionRef.detectChanges();
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
