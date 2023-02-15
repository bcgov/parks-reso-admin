import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicMetricComponent } from './basic-metric/basic-metric.component';
import { CountToDirective } from '../../utils/count-to.directive';
import { ChartMetricComponent } from './chart-metric/chart-metric.component';
import { registerGlobalChartPlugins } from './chart-metric/chart-metric-plugins';
import { MetricCardComponent } from './metric-card/metric-card.component';

registerGlobalChartPlugins();

@NgModule({
  declarations: [
    BasicMetricComponent,
    CountToDirective,
    ChartMetricComponent,
    MetricCardComponent,
  ],
  imports: [CommonModule],
  exports: [BasicMetricComponent, ChartMetricComponent, MetricCardComponent],
})
export class SharedMetricsModule {}
