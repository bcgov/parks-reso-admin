import { Component, OnInit } from '@angular/core';
import { ParkEditFormComponent } from '../park-edit-form/park-edit-form.component';

@Component({
    selector: 'app-park-edit',
    templateUrl: './park-edit.component.html',
    styleUrls: ['./park-edit.component.scss'],
    standalone: true,
    imports: [ParkEditFormComponent]
})
export class ParkEditComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
