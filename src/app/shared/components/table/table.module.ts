import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table.component';
import { TableRowComponent } from './table-row/table-row.component';
import { TableEditButtonComponent } from './table-components/edit-button/edit-button.component';

@NgModule({
  declarations: [TableComponent, TableRowComponent, TableEditButtonComponent],
  imports: [CommonModule],
  exports: [TableComponent],
})
export class TableModule {}
