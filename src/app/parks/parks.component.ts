import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-parks',
  templateUrl: './parks.component.html',
  styleUrls: ['./parks.component.scss']
})
export class ParksComponent implements OnInit {

  public loading = true;

  constructor() { }

  ngOnInit() {
    this.loading = false;
  }

}
