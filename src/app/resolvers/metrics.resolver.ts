import { Injectable } from '@angular/core';

import { DataService } from '../services/data.service';
import { Constants } from '../shared/utils/constants';
import { MetricsService } from '../services/metrics.service';

@Injectable({
  providedIn: 'root',
})
export class MetricsResolver  {
  constructor(
    private metricsService: MetricsService,
    private dataService: DataService
  ) { }
  resolve() {
    const params = this.dataService.getItemValue(Constants.dataIds.METRICS_FILTERS_PARAMS);
    if (!params || !params.park) {
      this.metricsService.setFilterParams({
        dateRange: null,
        park: 'all',
        facility: null,
        timeSpan: null
      })
    }
  }
}
