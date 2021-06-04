import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IColumnObject } from 'app/shared/components/table-template/table-object';
import { Constants } from 'app/shared/utils/constants';
import { PassTableRowComponent } from './pass-table-row/pass-table-row.component';

@Component({
  selector: 'app-pass-list',
  templateUrl: './pass-list.component.html',
  styleUrls: ['./pass-list.component.scss']
})
export class PassListComponent implements OnInit {
  // Component
  public loading = true;
  // This will be changed to service.
  public data;
  public totalListItems = 0;
  public tableRowComponent = PassTableRowComponent;

  // Table
  public tableColumns: IColumnObject[] = [
    {
      name: 'Reg #',
      value: 'registrationNumber',
      width: 'col-2'
    },
    {
      name: 'First Name',
      value: 'firstName',
      width: 'col-2'
    },
    {
      name: 'Last Name',
      value: 'lastName',
      width: 'col-2'
    },
    {
      name: 'Email',
      value: 'email',
      width: 'col-2'
    },
    {
      name: 'Guests',
      value: 'numberOfGuests',
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
    private _changeDetectionRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.data = Array.from(Constants.mockPassList);
    this.totalListItems = this.data.length;
    this._changeDetectionRef.detectChanges();
    this.loading = false;
  }
}
