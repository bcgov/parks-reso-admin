import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IColumnObject } from 'app/shared/components/table-template/table-object';
import { Constants } from 'app/shared/utils/constants';
import { ParkTableRowComponent } from './park-table-row/park-table-row.component';

@Component({
  selector: 'app-park-list',
  templateUrl: './park-list.component.html',
  styleUrls: ['./park-list.component.scss']
})
export class ParkListComponent implements OnInit {
  // Component
  public loading = true;
  // This will be changed to service.
  public tempData;
  public tableRowComponent = ParkTableRowComponent;

  // Table
  public tableColumns: IColumnObject[] = [
    {
      name: 'Name',
      value: 'name',
      width: 'col-5'
    },
    {
      name: 'Status',
      value: 'status',
      width: 'col-5'
    },
    {
      name: 'Actions',
      value: '',
      width: 'col-2',
      nosort: true
    }
  ];

  constructor(
    private _changeDetectionRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.tempData = Array.from(Constants.mockParkList);
    this._changeDetectionRef.detectChanges();
    this.loading = false;
  }
}
