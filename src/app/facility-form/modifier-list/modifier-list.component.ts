import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
// import { takeWhile } from 'rxjs/operators';

import { ModifierTableRowComponent } from './modifier-table-row/modifier-table-row.component';
import { IColumnObject } from 'app/shared/components/table-template/table-object';
// import { ReservationService } from 'app/services/reservation.service';

@Component({
  selector: 'app-modifier-list',
  templateUrl: './modifier-list.component.html',
  styleUrls: ['./modifier-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModifierListComponent implements OnInit, OnDestroy {
  @Input() parkSk;
  @Input() facilitySk;

  private alive = true;
  // Component
  public loading = true;
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

  // Table
  public tableColumns: IColumnObject[] = [
    {
      name: 'Date',
      width: 'col-3',
      nosort: true
    },
    {
      name: 'AM Change',
      width: 'col-2',
      nosort: true
    },
    {
      name: 'PM Change',
      width: 'col-2',
      nosort: true
    },
    {
      name: 'All-Day Change',
      width: 'col-2',
      nosort: true
    },
    {
      name: '',
      width: 'col-3',
      nosort: true
    }
  ];

  public tableRowComponent = ModifierTableRowComponent;

  constructor(
    // private reservationService: ReservationService,
    private _changeDetectionRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // This is the pattern from park-list.component.ts

    // this.reservationService.getListValue()
    //   .pipe(takeWhile(() => this.alive))
    //   .subscribe((res) => {
    //     if (res) {
    //       this.data = res.map(item => {
    //         return { rowData: item };
    //       });
    //       this.totalListItems = this.data.length;
    //       this.loading = false;
    //       this._changeDetectionRef.detectChanges();
    //     }
    //   });

    // Temporary dummy data for UI creation

    if (this.alive) {
      this.data = [
        {
          rowData: {
            pk: 'reservations::Mount Seymour Provincial Park::Daily Additional P1 and Lower P5 (Weather Dependent)',
            sk: '2022-07-26',
            capacities: {
              AM: { M: { baseCapacity: { N: '1000' }, capacityModifier: { N: '120' }, availablePasses: { N: '91' } } },
              PM: { M: { baseCapacity: { N: '1000' }, capacityModifier: { N: '-105' }, availablePasses: { N: '89' } } }
            }
          }
        },
        {
          rowData: {
            pk: 'reservations::Mount Seymour Provincial Park::Daily Additional P1 and Lower P5 (Weather Dependent)',
            sk: '2022-07-27',
            capacities: {
              AM: { M: { baseCapacity: { N: '1000' }, capacityModifier: { N: '0' }, availablePasses: { N: '91' } } },
              PM: { M: { baseCapacity: { N: '1000' }, capacityModifier: { N: '0' }, availablePasses: { N: '89' } } }
            }
          }
        },
        {
          rowData: {
            pk: 'reservations::Mount Seymour Provincial Park::Daily Additional P1 and Lower P5 (Weather Dependent)',
            sk: '2022-07-28',
            capacities: {
              AM: { M: { baseCapacity: { N: '1000' }, capacityModifier: { N: '0' }, availablePasses: { N: '91' } } },
              PM: { M: { baseCapacity: { N: '1000' }, capacityModifier: { N: '0' }, availablePasses: { N: '89' } } }
            }
          }
        },
        {
          rowData: {
            pk: 'reservations::Mount Seymour Provincial Park::Daily Additional P1 and Lower P5 (Weather Dependent)',
            sk: '2022-07-29',
            capacities: {
              AM: { M: { baseCapacity: { N: '1000' }, capacityModifier: { N: '40' }, availablePasses: { N: '91' } } },
              PM: { M: { baseCapacity: { N: '1000' }, capacityModifier: { N: '0' }, availablePasses: { N: '89' } } }
            }
          }
        }
      ];
      this.totalListItems = 2;
      this.loading = false;
      this._changeDetectionRef.detectChanges();
    }
  }

  ngOnDestroy() {
    this.alive = false;
  }

  private hasModifier(row, timeslot) {
    return (
      row.rowData &&
      row.rowData.capacities &&
      row.rowData.capacities.hasOwnProperty(timeslot) &&
      row.rowData.capacities[timeslot].M &&
      row.rowData.capacities[timeslot].M.capacityModifier &&
      row.rowData.capacities[timeslot].M.capacityModifier.N &&
      row.rowData.capacities[timeslot].M.capacityModifier.N !== '0'
    );
  }

  get filteredData() {
    // may also need to filter out timeslots that have been turned off through the faclity object
    return this.data
      .filter(row => this.hasModifier(row, 'AM') || this.hasModifier(row, 'PM') || this.hasModifier(row, 'DAY'))
      .sort((a, b) => {
        return a.rowData.sk > b.rowData.sk ? 1 : -1;
      });
  }
}
