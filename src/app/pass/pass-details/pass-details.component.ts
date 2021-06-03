import { Component, OnInit } from '@angular/core';
import { Constants } from 'app/shared/utils/constants';

@Component({
  selector: 'app-pass-details',
  templateUrl: './pass-details.component.html',
  styleUrls: ['./pass-details.component.scss']
})
export class PassDetailsComponent implements OnInit {
  public data = Constants.mockPass1;
  constructor() { }

  ngOnInit() {
  }

}
