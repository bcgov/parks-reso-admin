import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-parks-detail',
  templateUrl: './parks-detail.component.html',
  styleUrls: ['./parks-detail.component.scss']
})
export class ParksDetailComponent implements OnInit {

  public loading = true;
  private currentFeatureId = 987654321;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.loading = false;
  }

  activateLoading(e: Event) {
    e.stopPropagation();
    this.router.navigate(['../details', this.currentFeatureId, 'details'], {relativeTo: this.route});
  }

  editPark(e: Event) {
    e.stopPropagation();
    this.router.navigate(['../edit'], {relativeTo: this.route});
  }

  addParkFeature(e: Event) {
    e.stopPropagation();
    this.router.navigate(['../add-feature'], {relativeTo: this.route});
  }

}
