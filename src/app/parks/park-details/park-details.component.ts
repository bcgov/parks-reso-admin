import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { FacilityService } from 'src/app/services/facility.service';
import { Constants } from 'src/app/shared/utils/constants';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-park-details',
  templateUrl: './park-details.component.html',
  styleUrls: ['./park-details.component.scss'],
})
export class ParkDetailsComponent implements OnDestroy {
  private subscriptions = new Subscription();
  public park;

  constructor(
    protected dataService: DataService,
    protected facilityService: FacilityService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.subscriptions.add(
      dataService
        .watchItem(Constants.dataIds.CURRENT_PARK)
        .subscribe((res) => {
          if (res && res[0]) {
            this.park = res[0];
            this.facilityService.fetchFacilities(this.park.sk);
          }
        })
    );
  }

  navigate(nav) {
    this.router.navigate([nav], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
