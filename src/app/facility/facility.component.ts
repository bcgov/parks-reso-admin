import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Constants } from 'app/shared/utils/constants';

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
    this.showHeader = this.route.snapshot.firstChild.data.module === 'parks';
    this.navSelected = this.route.snapshot.firstChild.data.component;
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(() => {
        this.showHeader = this.route.snapshot.firstChild.data.module === 'parks';
        this.navSelected = this.route.snapshot.firstChild.data.component;
      });
  }


  navigate(nav) {
    this.navSelected = nav;
    this.router.navigate([nav], { relativeTo: this.route });
  }
}
