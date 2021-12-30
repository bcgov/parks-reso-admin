import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PassService } from 'app/services/pass.service';
import { IColumnObject } from 'app/shared/components/table-template/table-object';
import { takeWhile } from 'rxjs/operators';
import { PassTableRowComponent } from './pass-table-row/pass-table-row.component';
const moment = require('moment-timezone');

@Component({
  selector: 'app-pass-list',
  templateUrl: './pass-list.component.html',
  styleUrls: ['./pass-list.component.scss']
})
export class PassListComponent implements OnInit, OnDestroy {
  @Input() parkSk;
  @Input() facilitySk;
  @Input() time;
  private alive = true;

  public ExclusiveStartKeyPK = null;
  public ExclusiveStartKeySK = null;
  private appendList = false;

  // Component
  public loading = true;
  public loadingMore = false;
  public downloading = false;
  // This will be changed to service.
  public data = [];
  public totalListItems = 0;
  public options = {
    showHeader: true,
    showPagination: false,
    showPageSizePicker: false,
    showPageCountDisplay: false,
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
      name: 'Guests',
      value: 'numberOfGuests',
      width: 'col-1',
      nosort: true
    },
    {
      name: 'Date',
      value: 'date',
      width: 'col-2',
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

  constructor(private _changeDetectionRef: ChangeDetectorRef, private passService: PassService) {}

  ngOnInit() {
    this.passService
      .getListValue()
      .pipe(takeWhile(() => this.alive))
      .subscribe(res => {
        if (res && res.data) {
          if (res.LastEvaluatedKey) {
            this.ExclusiveStartKeyPK = res.LastEvaluatedKey.pk.S;
            this.ExclusiveStartKeySK = res.LastEvaluatedKey.sk.S;
          } else {
            this.ExclusiveStartKeyPK = null;
            this.ExclusiveStartKeySK = null;
          }
          const tempList = res.data.map(item => {
            item.date = moment(item.date).local().toDate();
            return { rowData: item };
          });
          if (this.appendList) {
            this.data = this.data.concat(tempList);
            this.appendList = false;
          } else {
            this.data = tempList;
          }
          this.totalListItems = this.data.length;
          if (this.totalListItems > 0 && this.data[0].rowData.facilityType === 'Parking') {
            this.tableColumns = [
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
                name: 'License',
                value: 'license',
                width: 'col-1',
                nosort: true
              },
              {
                name: 'Date',
                value: 'date',
                width: 'col-2',
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
          }
          this.loading = false;
          this.loadingMore = false;
          this._changeDetectionRef.detectChanges();
        }
      });
  }

  loadMore() {
    this.loadingMore = true;
    this.appendList = true;
    this.passService.fetchData(
      null,
      this.parkSk,
      this.facilitySk,
      this.time,
      this.ExclusiveStartKeyPK,
      this.ExclusiveStartKeySK,
      this.passService.lastSearchParams.queryParams
    );
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
