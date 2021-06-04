import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TableRowComponent } from 'app/shared/components/table-template/table-row-component';

@Component({
  selector: 'tr[app-park-table-row]',
  templateUrl: './park-table-row.component.html',
  styleUrls: ['./park-table-row.component.scss']
})
export class ParkTableRowComponent extends TableRowComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit() { }

  validate(value) {
    if (this.rowData && this.rowData.hasOwnProperty(value)) {
      return this.rowData[value];
    } else {
      return '-';
    }
  }

  navigate(route) {
    this.router.navigate(['../', this.rowData.sk, route], { relativeTo: this.route });
  }
}
