import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FacilityService } from 'app/services/facility.service';
import { filter, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-facility',
  templateUrl: './facility.component.html',
  styleUrls: ['./facility.component.scss']
})
export class FacilityComponent implements OnInit, OnDestroy {
  private alive = true;

  public facility;
  public showHeader = true;
  public navSelected = 'details';
  public loading = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private facilityService: FacilityService,
    private _changeDetectionRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    if (this.route.snapshot.firstChild && this.route.snapshot.firstChild.data && this.route.snapshot.firstChild.data.module) {
      this.showHeader = this.route.snapshot.firstChild.data.module === 'facility';
      this.navSelected = this.route.snapshot.firstChild.data.component;
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          this.showHeader = this.route.snapshot.firstChild.data.module === 'facility';
          this.navSelected = this.route.snapshot.firstChild.data.component;
        });
    }

    this.facilityService.getItemValue()
      .pipe(takeWhile(() => this.alive))
      .subscribe((res) => {
        if (res) {
          this.facility = res;
          this.loading = false;
          this._changeDetectionRef.detectChanges();
        }
      });
  }

  navigate(nav) {
    this.navSelected = nav;
    this.router.navigate([nav], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
