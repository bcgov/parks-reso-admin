import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

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

    if (this.route.snapshot.firstChild && this.route.snapshot.firstChild.data) {
      this.showHeader = this.route.snapshot.firstChild.data.module === 'parks';
      this.navSelected = this.route.snapshot.firstChild.data.component;
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          this.showHeader = this.route.snapshot.firstChild.data.module === 'parks';
          this.navSelected = this.route.snapshot.firstChild.data.component;
        });
    }
  }
  navigate(nav) {
    this.router.navigate([nav], { relativeTo: this.route });
  }
}
