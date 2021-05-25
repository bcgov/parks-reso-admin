import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss']
})
export class MetricsComponent implements OnInit {
  public loading = true;
  constructor() { }

  ngOnInit() {
    this.loading = false;
  }

}
