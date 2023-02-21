import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricsComponent } from './metrics.component';
import { SharedMetricsModule } from '../shared/components/metrics/shared-metrics.module';

@NgModule({
  declarations: [MetricsComponent],
  imports: [CommonModule, SharedMetricsModule],
  providers: [],
})
export class MetricsModule {}
