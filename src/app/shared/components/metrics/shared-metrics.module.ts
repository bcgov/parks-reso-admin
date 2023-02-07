import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicMetricComponent } from './basic-metric/basic-metric.component';
import { CountToDirective } from '../../utils/count-to.directive';

@NgModule({
  declarations: [BasicMetricComponent, CountToDirective],
  imports: [CommonModule],
  exports: [BasicMetricComponent],
})
export class SharedMetricsModule {}
