import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table.component';
import { TableRowComponent } from './table-row/table-row.component';
import { TableButtonComponent } from './table-components/table-button/table-button.component';

@NgModule({
  declarations: [TableComponent, TableRowComponent, TableButtonComponent],
  imports: [CommonModule],
  exports: [TableComponent],
})
export class TableModule {}
