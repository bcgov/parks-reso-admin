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
    showPageSizePicker: false,
    showHeader: true
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
      name: 'First Name',
      value: 'firstName',
      width: 'col-2',
      nosort: true
    },
    {
      name: 'Last Name',
      value: 'lastName',
      width: 'col-2',
      nosort: true
    },
    {
      name: 'Email',
      value: 'email',
      width: 'col-2',
      nosort: true
    },
    {
      name: 'Guests',
      value: 'numberOfGuests',
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
