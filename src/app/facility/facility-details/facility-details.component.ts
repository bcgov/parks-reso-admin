import { Component, OnInit } from '@angular/core';
import { Constants } from 'app/shared/utils/constants';

@Component({
  selector: 'app-facility-details',
  templateUrl: './facility-details.component.html',
  styleUrls: ['./facility-details.component.scss']
})
export class FacilityDetailsComponent implements OnInit {
  public data = Constants.mockFacility1;

  constructor() { }

  ngOnInit() {
  }

}
