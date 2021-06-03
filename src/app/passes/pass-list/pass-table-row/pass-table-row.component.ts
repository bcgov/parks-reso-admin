import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TableRowComponent } from 'app/shared/components/table-template/table-row-component';

@Component({
  selector: 'tr[app-pass-table-row]',
  templateUrl: './pass-table-row.component.html',
  styleUrls: ['./pass-table-row.component.scss']
})
export class PassTableRowComponent extends TableRowComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() { }

  navigate(route) {
    this.router.navigate(['../', 'pass', this.rowData._id, route], { relativeTo: this.route });
  }
}
