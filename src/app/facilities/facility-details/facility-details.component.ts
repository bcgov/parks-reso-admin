import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { PassService } from 'src/app/services/pass.service';
import { Constants } from 'src/app/shared/utils/constants';

@Component({
  selector: 'app-facility-details',
  templateUrl: './facility-details.component.html',
  styleUrls: ['./facility-details.component.scss'],
})
export class FacilityDetailsComponent implements OnInit {
  private subscriptions = new Subscription();
  public facility;

  constructor(protected dataService: DataService, protected passService: PassService) {
    this.subscriptions.add(
      dataService
        .getItemValue(Constants.dataIds.CURRENT_FACILITY)
        .subscribe((res) => {
          if (res && res[0]) {
            this.facility = res[0];
            const passObj = {
              parkSk: this.facility.pk.split('::')[1],
              facilitySk: this.facility.name,
              passType: this.timeOfDay(this.facility.bookingTimes)
            }
            this.passService.fetchPasses(passObj);
          }
        })
    );
  }

  ngOnInit(): void {}
  
  // Fetch AM/PM/DAY if exists
  timeOfDay(times): any {
    const list = Object.keys(times);
    return list[0];
  }
}
