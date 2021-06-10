import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FacilityService } from 'app/services/facility.service';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-facility-details',
  templateUrl: './facility-details.component.html',
  styleUrls: ['./facility-details.component.scss']
})
export class FacilityDetailsComponent implements OnInit, OnDestroy {
  private alive = true;

  public loading = true;
  public data;

  constructor(
    private facilityService: FacilityService,
    private _changeDetectionRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.facilityService.getItemValue()
      .pipe(takeWhile(() => this.alive))
      .subscribe((res) => {
        if (res) {
          this.data = res;
          this.loading = false;
          this._changeDetectionRef.detectChanges();
        }
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
