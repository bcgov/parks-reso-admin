import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-parks',
  templateUrl: './parks.component.html',
  styleUrls: ['./parks.component.scss']
})
export class ParksComponent implements OnInit {

  public loading = true;
  private currentParkId = 123456789;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.loading = false;
  }

  activateLoading(e: Event) {
    e.stopPropagation();
    this.router.navigate(['parks', this.currentParkId, 'details']);
  }

}
