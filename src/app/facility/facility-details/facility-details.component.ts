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
          this.passes = res.data;
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

  print(): void {
    this._changeDetectionRef.detectChanges();
    const printContent = document.getElementById('print-area');
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write(
      `<style>
        table {
            border-collapse: collapse;
            width: 100%;
        }

        td,
        th {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
        }
      </style>`
    );
    WindowPrt.document.write(`<h4>${this.passTypeSelected} passes for ${this.facility.name}</h4>`);
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }

  convertDate(date) {
    return new Date(date).toISOString().slice(0, 10);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
