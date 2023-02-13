import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicMetricComponent } from './basic-metric/basic-metric.component';
import { CountToDirective } from '../../utils/count-to.directive';
import { ChartMetricComponent } from './chart-metric/chart-metric.component';
import { registerGlobalChartPlugins } from './chart-metric/chart-metric-plugins';

registerGlobalChartPlugins();

@NgModule({
  declarations: [BasicMetricComponent, CountToDirective, ChartMetricComponent],
  imports: [CommonModule],
  exports: [BasicMetricComponent, ChartMetricComponent],
})
export class SharedMetricsModule {}
