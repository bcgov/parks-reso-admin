import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Constants } from 'app/shared/utils/constants';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-park',
  templateUrl: './park.component.html',
  styleUrls: ['./park.component.scss']
})
export class ParkComponent implements OnInit {

  public park = Constants.mockPark1;
  public navSelected = 'details';
  public showHeader = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    if (this.route.snapshot.firstChild && this.route.snapshot.firstChild.data && this.route.snapshot.firstChild.data.module){
      this.showHeader = this.route.snapshot.firstChild.data.module === 'park';
      this.navSelected = this.route.snapshot.firstChild.data.component;
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          this.showHeader = this.route.snapshot.firstChild.data.module === 'park';
          this.navSelected = this.route.snapshot.firstChild.data.component;
        });
    }
  }


  navigate(nav) {
    this.router.navigate([nav], { relativeTo: this.route });
  }
}
