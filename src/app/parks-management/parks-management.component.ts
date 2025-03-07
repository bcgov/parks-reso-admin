import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-parks-management',
    templateUrl: './parks-management.component.html',
    styleUrls: ['./parks-management.component.scss'],
    imports: [RouterOutlet]
})
export class ParksManagementComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
