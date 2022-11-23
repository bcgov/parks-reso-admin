import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { ModifierService } from 'src/app/services/modifier.service';
import { Constants } from 'src/app/shared/utils/constants';
import { Utils } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-facility-edit',
  templateUrl: './facility-edit.component.html',
  styleUrls: ['./facility-edit.component.scss'],
})
export class FacilityEditComponent implements OnDestroy {
  private subscriptions = new Subscription();
  public facility;
  public park;

  private utils = new Utils();

  constructor(
    protected dataService: DataService,
    protected modifierService: ModifierService
  ) {
    this.subscriptions.add(
      dataService
        .watchItem(Constants.dataIds.CURRENT_FACILITY)
        .subscribe((res) => {
          if (res && res[0]) {
            this.facility = res[0];
            this.updateModifiers();
          }
        })
    );
    this.subscriptions.add(
      dataService.watchItem(Constants.dataIds.CURRENT_PARK).subscribe((res) => {
        if (res && res[0]) {
          this.park = res[0];
          this.updateModifiers();
        }
      })
    );
  }

  updateModifiers() {
    if (this.park && this.facility) {
      const today = this.utils.getTodaysDate();
      this.modifierService.fetchData(this.park.sk, this.facility.sk, today);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
