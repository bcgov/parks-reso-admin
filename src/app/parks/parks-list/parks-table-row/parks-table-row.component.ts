import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableRowComponent } from 'app/shared/components/table-template/table-row-component';

@Component({
  selector: 'tr[app-parks-table-row]',
  templateUrl: './parks-table-row.component.html',
  styleUrls: ['./parks-table-row.component.scss']
})
export class ParksTableRowComponent extends TableRowComponent implements OnInit {

  constructor(private router: Router) {
    super();
  }

  ngOnInit() {
  }

  navigate(id) {
    this.router.navigate(['parks', id, 'details']);
  }
}
