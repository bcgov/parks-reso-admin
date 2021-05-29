import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from 'app/shared/utils/constants';

@Component({
  selector: 'app-park-details',
  templateUrl: './park-details.component.html',
  styleUrls: ['./park-details.component.scss']
})
export class ParkDetailsComponent implements OnInit {
  public loading = true;
  public park = Constants.mockPark1;

  private currentFacilityId = 987654321;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.loading = false;
  }

  activateLoading(e: Event) {
    e.stopPropagation();
    this.router.navigate(['../details', this.currentFacilityId, 'details'], { relativeTo: this.route });
  }

  editPark() {
    this.router.navigate(['../edit'], { relativeTo: this.route });
  }

  addParkFacility() {
    this.router.navigate(['../', 'facility', 'add'], { relativeTo: this.route });
  }

}
