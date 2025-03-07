import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { DataService } from 'src/app/services/data.service';
import { FacilityService } from 'src/app/services/facility.service';
import { ParkService } from 'src/app/services/park.service';
import { Constants } from 'src/app/shared/utils/constants';
import { Utils } from 'src/app/shared/utils/utils';
import { PassesListComponent } from './passes-list/passes-list.component';
import { PassesCapacityBarComponent } from './passes-capacity-bar/passes-capacity-bar.component';
import { NgIf, DatePipe } from '@angular/common';
import { PassesUtilityButtonsComponent } from './passes-utility-buttons/passes-utility-buttons.component';
import { PassesFilterComponent } from './passes-filter/passes-filter.component';

@Component({
    selector: 'app-pass-search',
    templateUrl: './pass-search.component.html',
    styleUrls: ['./pass-search.component.scss'],
    imports: [PassesFilterComponent, PassesUtilityButtonsComponent, NgIf, PassesCapacityBarComponent, PassesListComponent, DatePipe]
})
export class PassSearchComponent implements OnDestroy {
  private subscriptions = new Subscription();
  public Utils = new Utils();
  public currentFacility;
  public currentPark;
  public currentDate;
  public currentPassType;

  constructor(
    protected dataService: DataService,
    protected configService: ConfigService,
    protected facilityService: FacilityService,
    protected parkService: ParkService
  ) {
    this.subscriptions.add(
      dataService
        .watchItem(Constants.dataIds.PASS_SEARCH_PARAMS)
        .subscribe((res) => {
          if (res) {
            this.currentFacility = res.facilityName;
            this.currentPark = this.parkService.getCachedPark({pk: 'park', sk: res.park})?.name;
            this.currentDate = res.date;
            this.currentPassType = res.passType;
          }
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
