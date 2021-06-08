import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ParkService } from 'app/services/park.service';
import { takeWhile } from 'rxjs/operators';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-park',
  templateUrl: './park.component.html',
  styleUrls: ['./park.component.scss']
})
export class ParkComponent implements OnInit, OnDestroy {
  private alive = true;

  public park;
  public navSelected = 'details';
  public showHeader = true;
  public loading = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private parkService: ParkService,
    private _changeDetectionRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    if (this.route.snapshot.firstChild && this.route.snapshot.firstChild.data && this.route.snapshot.firstChild.data.module) {
      this.showHeader = this.route.snapshot.firstChild.data.module === 'park';
      this.navSelected = this.route.snapshot.firstChild.data.component;
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          this.showHeader = this.route.snapshot.firstChild.data.module === 'park';
          this.navSelected = this.route.snapshot.firstChild.data.component;
        });
    }

    this.parkService.getItemValue()
      .pipe(takeWhile(() => this.alive))
      .subscribe((res) => {
        if (res) {
          this.park = res;
          this.loading = false;
          this._changeDetectionRef.detectChanges();
        }
      });
  }


  navigate(nav) {
    this.router.navigate([nav], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
