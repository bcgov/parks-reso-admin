import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ParkService } from 'app/services/park.service';
import { IColumnObject } from 'app/shared/components/table-template/table-object';
import { takeWhile } from 'rxjs/operators';
import { ParkTableRowComponent } from './park-table-row/park-table-row.component';

@Component({
  selector: 'app-park-list',
  templateUrl: './park-list.component.html',
  styleUrls: ['./park-list.component.scss']
})
export class ParkListComponent implements OnInit, OnDestroy {
  private alive = true;
  // Component
  public loading = true;
  // This will be changed to service.
  public data = null;
  public totalListItems = 0;

  public tableRowComponent = ParkTableRowComponent;

  // Table
  public tableColumns: IColumnObject[] = [
    {
      name: 'Name',
      value: 'name',
      width: 'col-5',
      nosort: true
    },
    {
      name: 'Status',
      value: 'status',
      width: 'col-5',
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
    private parkService: ParkService
  ) { }

  ngOnInit() {
    this.parkService.getValue()
      .pipe(takeWhile(() => this.alive))
      .subscribe((res) => {
        this.loading = true;
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
