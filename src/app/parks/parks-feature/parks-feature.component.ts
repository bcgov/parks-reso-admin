import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-parks-feature',
  templateUrl: './parks-feature.component.html',
  styleUrls: ['./parks-feature.component.scss']
})
export class ParksFeatureComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
  }

  editParkFeature(e: Event) {
    e.stopPropagation();
    this.router.navigate(['../edit'], {relativeTo: this.route});
  }

}
