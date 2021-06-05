import { Component, OnInit } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from 'app/shared/utils/constants';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-pass',
  templateUrl: './pass.component.html',
  styleUrls: ['./pass.component.scss']
})
export class PassComponent implements OnInit {
  public pass = Constants.mockPass1;
  public navSelected = 'details';
  public showHeader = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    if (this.route.snapshot.firstChild) {
      this.showHeader = this.route.snapshot.firstChild.data.module === 'pass';
      this.navSelected = this.route.snapshot.firstChild.data.component;
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          this.showHeader = this.route.snapshot.firstChild.data.module === 'pass';
          this.navSelected = this.route.snapshot.firstChild.data.component;
        });
    }
  }


  navigate(nav) {
    this.router.navigate([nav], { relativeTo: this.route });
  }

}
