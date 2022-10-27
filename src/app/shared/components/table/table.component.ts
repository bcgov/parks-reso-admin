import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';

export interface columnSchema {
  id: string; // unique column identifier
  displayHeader: string; // column header title
  mapValue: Function; // function that returns the value of the cell
  mapDisplay?: Function; // function that returns what to display in the cell, if different from the value.
  cellTemplate?: Function; // function that returns a component to fill the cell
  width?: string; // relative column width (0-100%)
  columnClasses?: string; // injectable column classes
}

export interface tableSchema {
  id: string; // unique table identifier
  tableClasses?: string; // injectable table classes
  rowClick?: Function; // function to execute on every row
  columns: columnSchema[]; // table columns
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnChanges, OnDestroy {
  @Input() tableSchema: tableSchema;
  @Input() data: any[];
  @Input() emptyTableMsg = 'This table is empty.';

  public columns;
  public rows: any = [];
  public loading: boolean = false;
  private subscriptions = new Subscription();

  constructor(protected loadingService: LoadingService) {
    this.subscriptions.add(
      loadingService.getLoadingStatus().subscribe((res) => {
        this.loading = res;
      })
    );
  }

  ngOnChanges() {
    this.parseData();
  }

  async parseData() {
    this.rows = [];
    if (this.data && this.data.length > 0) {
      for (const item of this.data) {
        let row: any = {};
        if (this.tableSchema.rowClick) {
          row.onClick = this.tableSchema.rowClick(item);
        }
        this.tableSchema.columns.map(async (col) => {
          // we pass the whole row to column functions
          row[col.id] = {
            value: col.mapValue(item),
          };
          if (col.mapDisplay) {
            row[col.id].display = col.mapDisplay(item);
          }
          if (col.cellTemplate) {
            row[col.id].cellTemplate = col.cellTemplate(item);
          }
          row['raw'] = item;
        });
        this.rows.push(row);
      }
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
