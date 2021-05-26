import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-park-details',
  templateUrl: './park-details.component.html',
  styleUrls: ['./park-details.component.scss']
})
export class ParkDetailsComponent implements OnInit {

  public loading = true;
  private currentFacilityId = 987654321;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    console.log('WATASFSD');
    this.loading = false;
  }

  activateLoading(e: Event) {
    e.stopPropagation();
    this.router.navigate(['../details', this.currentFacilityId, 'details'], { relativeTo: this.route });
  }

  editPark(e: Event) {
    e.stopPropagation();
    this.router.navigate(['../edit'], { relativeTo: this.route });
  }

  addParkFacility(e: Event) {
    e.stopPropagation();
    this.router.navigate(['../add-Facility'], { relativeTo: this.route });
  }

}
