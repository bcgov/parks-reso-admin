import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-parks',
  templateUrl: './parks.component.html',
  styleUrls: ['./parks.component.scss']
})
export class ParksComponent implements OnInit {

  public loading = true;
  private currentParkId = 123456789;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.loading = false;
  }

  activateLoading(e: Event) {
    e.stopPropagation();
    this.router.navigate([this.currentParkId, 'details'], {relativeTo: this.route});
  }

  addPark(e: Event) {
    e.stopPropagation();
    this.router.navigate(['add-park'], {relativeTo: this.route});
  }

}
