import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FacilityService } from 'app/services/facility.service';
import { PassService } from 'app/services/pass.service';
import { PassUtils } from 'app/shared/utils/pass-utils';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-facility-details',
  templateUrl: './facility-details.component.html',
  styleUrls: ['./facility-details.component.scss']
})
export class FacilityDetailsComponent implements OnInit, OnDestroy {
  private alive = true;

  public loadingFacility = true;
  public loadingPasses = true;
  public facility;
  public passes;
  public passTypeSelected = 'AM';

  public parkSk;
  public facilitySk;

  constructor(
    private facilityService: FacilityService,
    private passService: PassService,
    private _changeDetectionRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.facilityService.getItemValue()
      .pipe(takeWhile(() => this.alive))
      .subscribe((res) => {
        if (res) {
          this.facility = res;
          this.facilitySk = res.sk;
          this.parkSk = res.pk.replace('facility::', '');

          // Default order AM > PM > DAY
          if (this.facility) {
            if (this.facility.bookingTimes.AM) {
              this.passTypeSelected = 'AM';
            } else if (this.facility.bookingTimes.PM) {
              this.passTypeSelected = 'PM';
            } else if (this.facility.bookingTimes.DAY) {
              this.passTypeSelected = 'DAY';
            }
          }

          this.loadingFacility = false;
          this._changeDetectionRef.detectChanges();
        }
      });
    this.passService.getListValue()
      .pipe(takeWhile(() => this.alive))
      .subscribe((res) => {
        if (res) {
          this.passes = res;
          this.loadingPasses = false;
          this._changeDetectionRef.detectChanges();
        }
      });
  }

  fetchPassTable(time) {
    this.loadingPasses = true;
    this.passTypeSelected = time;
    this.passService.fetchData(null, this.parkSk, this.facilitySk, time);
  }

  exportCsv(): void {
    PassUtils.exportToCsv(this.passes);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
