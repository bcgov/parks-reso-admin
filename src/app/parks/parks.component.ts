import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-parks',
  templateUrl: './parks.component.html',
  styleUrls: ['./parks.component.scss']
})
export class ParksComponent implements OnInit {
  public navSelected = 'list';
  public showHeader = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
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
    // this.navSelected = nav;
    this.router.navigate([nav], { relativeTo: this.route });
  }
}
