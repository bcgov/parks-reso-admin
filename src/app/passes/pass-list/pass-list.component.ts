import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { PassService } from 'app/services/pass.service';
import { IColumnObject } from 'app/shared/components/table-template/table-object';
import { takeWhile } from 'rxjs/operators';
import { PassTableRowComponent } from './pass-table-row/pass-table-row.component';

@Component({
  selector: 'app-pass-list',
  templateUrl: './pass-list.component.html',
  styleUrls: ['./pass-list.component.scss']
})
export class PassListComponent implements OnInit, OnDestroy {
  private alive = true;
  // Component
  public loading = true;
  public downloading = false;
  // This will be changed to service.
  public data = [];
  public totalListItems = 0;
  public options = {
    showHeader: true,
    showPagination: true,
    showPageSizePicker: false,
    showPageCountDisplay: true,
    disableRowHighlight: false,
    showTopControls: true,
    rowSpacing: 0
  };
  public tableRowComponent = PassTableRowComponent;

  // Table
  public tableColumns: IColumnObject[] = [
    {
      name: 'Reg #',
      value: 'registrationNumber',
      width: 'col-2',
      nosort: true
    },
    {
      name: 'Email',
      value: 'email',
      width: 'col-3',
      nosort: true
    },
    {
      name: 'Date',
      value: 'date',
      width: 'col-3',
      nosort: true
    },
    {
      name: 'Status',
      value: 'passStatus',
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
    private passService: PassService
  ) { }

  ngOnInit() {
    this.passService.getListValue()
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
