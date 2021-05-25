import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-parks-detail',
  templateUrl: './parks-detail.component.html',
  styleUrls: ['./parks-detail.component.scss']
})
export class ParksDetailComponent implements OnInit {

  private currentAreaId: 987654321;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  activateLoading(e: Event,) {
    e.stopPropagation();
    this.router.navigate([this.activatedRoute, this.currentAreaId, 'details']);
  }

  parkNavigate(e: Event, path: any[]) {
    e.stopPropagation();
    this.router.navigate([`./${path}`]);
  }

}
