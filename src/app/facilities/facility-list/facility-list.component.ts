import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FacilityService } from 'app/services/facility.service';
import { IColumnObject } from 'app/shared/components/table-template/table-object';
import { takeWhile } from 'rxjs/operators';
import { FacilityTableRowComponent } from './facility-table-row/facility-table-row.component';

@Component({
  selector: 'app-facility-list',
  templateUrl: './facility-list.component.html',
  styleUrls: ['./facility-list.component.scss']
})
export class FacilityListComponent implements OnInit, OnDestroy {
  private alive = true;

  // Component
  public loading = true;
  // This will be changed to service.
  public data = [];
  public totalListItems = 0;
  public options = {
    showHeader: true,
    showPagination: true,
    showPageSizePicker: false,
    showPageCountDisplay: false,
    disableRowHighlight: false,
    showTopControls: true,
    rowSpacing: 0
  };
  public tableRowComponent = FacilityTableRowComponent;

  // Table
  public tableColumns: IColumnObject[] = [
    {
      name: 'Name',
      value: 'name',
      width: 'col-3',
      nosort: true
    },
    {
      name: 'Type',
      value: 'type',
      width: 'col-3',
      nosort: true
    },
    {
      name: 'Status',
      value: 'status',
      width: 'col-2',
      nosort: true
    },
    {
      name: 'Visible',
      value: 'visible',
      width: 'col-2',
      nosort: true
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
    private facilityService: FacilityService
  ) { }

  ngOnInit() {
    this.facilityService.getListValue()
      .pipe(takeWhile(() => this.alive))
      .subscribe((res) => {
        if (res) {
          this.data = res.map(item => {
            return { rowData: item };
          });
          this.totalListItems = this.data.length;
          this.loading = false;
          this._changeDetectionRef.detectChanges();
        }
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
