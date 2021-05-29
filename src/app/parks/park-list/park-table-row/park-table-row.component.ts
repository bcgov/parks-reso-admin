import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TableRowComponent } from 'app/shared/components/table-template/table-row-component';

@Component({
  selector: 'tr[app-park-table-row]',
  templateUrl: './park-table-row.component.html',
  styleUrls: ['./park-table-row.component.scss']
})
export class ParkTableRowComponent extends TableRowComponent implements OnInit {

  constructor(private router: Router) {
    super();
  }

  ngOnInit() { }

  navigate(route) {
    this.router.navigate(['parks', this.rowData._id, route]);
  }
}
