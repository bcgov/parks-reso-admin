import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { Constants } from 'src/app/shared/utils/constants';

@Component({
  selector: 'app-manual-entry',
  templateUrl: './manual-entry.component.html',
  styleUrls: ['./manual-entry.component.scss'],
})
export class ManualEntryComponent implements OnDestroy {
  private subscriptions = new Subscription();

  public parks = [];

  public model = {
    park: null,
    facility: null,
    reservationNumber: null,
    firstName: null,
    lastName: null,
    email: null,
  };

  constructor(private dataService: DataService) {
    this.subscriptions.add(
      this.dataService
        .watchItem(Constants.dataIds.PARKS_LIST)
        .subscribe((parks) => {
          if (parks) {
            parks.forEach((park) => {
              this.parks.push({
                label: park.name,
                value: park.sk,
              });
            });
          }
        })
    );
  }

  onSubmit() {
    console.log(this.model);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
