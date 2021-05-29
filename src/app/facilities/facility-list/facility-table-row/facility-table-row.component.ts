import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TableRowComponent } from 'app/shared/components/table-template/table-row-component';

@Component({
  selector: 'tr[app-facility-table-row]',
  templateUrl: './facility-table-row.component.html',
  styleUrls: ['./facility-table-row.component.scss']
})
export class FacilityTableRowComponent extends TableRowComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) {
    super();
  }

  ngOnInit() { }

  navigate(route) {
    this.router.navigate(['../', 'facility', this.rowData._id, route], { relativeTo: this.route });
  }
}
