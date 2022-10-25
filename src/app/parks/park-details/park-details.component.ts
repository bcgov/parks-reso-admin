import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { Constants } from 'src/app/shared/utils/constants';

@Component({
  selector: 'app-park-details',
  templateUrl: './park-details.component.html',
  styleUrls: ['./park-details.component.scss']
})
export class ParkDetailsComponent implements OnInit {
  private subscriptions = new Subscription();
  public park;

  constructor(
    protected dataService: DataService
  ) {
    this.subscriptions.add(
      dataService
        .getItemValue(Constants.dataIds.CURRENT_PARK)
        .subscribe((res) => {
          if (res && res[0]){
            this.park = res[0];
          }
        })
    );
   }

  ngOnInit(): void {
  }

}
