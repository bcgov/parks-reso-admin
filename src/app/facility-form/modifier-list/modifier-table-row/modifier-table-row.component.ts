import { Component, OnInit } from '@angular/core';
import { DialogService } from 'ng2-bootstrap-modal';
import { ConfirmComponent } from '../../../confirm/confirm.component';
import { TableRowComponent } from '../../../shared/components/table-template/table-row-component';
import { DateTime } from 'luxon';

@Component({
  selector: 'tr[app-modifier-table-row]',
  templateUrl: './modifier-table-row.component.html',
  styleUrls: ['./modifier-table-row.component.scss']
})
export class ModifierTableRowComponent extends TableRowComponent implements OnInit {
  constructor(private dialogService: DialogService) {
    super();
  }

  ngOnInit() {}

  getDate() {
    const dateOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return DateTime.fromISO(this.rowData.sk).toLocaleString(dateOptions);
  }

  getModifier(type) {
    if (this.rowData && this.rowData.capacities && this.rowData.capacities.hasOwnProperty(type)) {
      const modifier = +this.rowData.capacities[type].M.capacityModifier.N;
      if (modifier > 0) {
        return `+ ${modifier}`;
      }
      if (modifier < 0) {
        return `- ${Math.abs(modifier)}`;
      }
      return 0;
    } else {
      return 'n/a';
    }
  }

  delete(value) {
    if (this.rowData && this.rowData.hasOwnProperty(value)) {
      this.dialogService
        .addDialog(
          ConfirmComponent,
          {
            title: `Deleting ${this.rowData['date']}`,
            message: 'Do you want to delete this capacity change?',
            okOnly: false
          },
          { backdropColor: 'rgba(0, 0, 0, 0.5)' }
        )
        .subscribe(async result => {
          if (result) {
            // this should zero-out all the capacityModifer attributes on the reservation object
            // (TBD: there has also been discussion about deleting the reservation object if there are no associated passes)
            window.alert(`zero-out or delete capacityModifiers for ${this.rowData[value]} (not implemented)`);
          }
        });
    }
  }
}
