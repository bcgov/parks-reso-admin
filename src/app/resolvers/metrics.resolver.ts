import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { MetricsService } from '../services/metrics.service';

@Injectable({
  providedIn: 'root',
})
export class MetricsResolver implements Resolve<void> {
  constructor(private metricsService: MetricsService) {}
  resolve() {
    this.metricsService.fetchData('passTotals');
  }
}
