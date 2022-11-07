import { Component, OnDestroy } from '@angular/core';
import { Utils } from 'ngx-bootstrap/utils';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { Constants } from 'src/app/shared/utils/constants';

@Component({
  selector: 'app-facility-edit',
  templateUrl: './facility-edit.component.html',
  styleUrls: ['./facility-edit.component.scss'],
})
export class FacilityEditComponent implements OnDestroy {
  private subscriptions = new Subscription();
  public facility;
  public park;

  constructor(protected dataService: DataService) {
    this.subscriptions.add(
      dataService
        .watchItem(Constants.dataIds.CURRENT_FACILITY)
        .subscribe((res) => {
          if (res && res[0]) {
            this.facility = res[0];
          }
        })
    );
    this.subscriptions.add(
      dataService.watchItem(Constants.dataIds.CURRENT_PARK).subscribe((res) => {
        if (res && res[0]) {
          this.park = res[0];
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
