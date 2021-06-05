import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Constants } from 'app/shared/utils/constants';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-facility',
  templateUrl: './facility.component.html',
  styleUrls: ['./facility.component.scss']
})
export class FacilityComponent implements OnInit {
  public facility = Constants.mockFacility1;
  public showHeader = true;
  public navSelected = 'details';

  constructor(
    private router: Router,
    private route: ActivatedRoute
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
  }


  navigate(nav) {
    this.navSelected = nav;
    this.router.navigate([nav], { relativeTo: this.route });
  }
}
