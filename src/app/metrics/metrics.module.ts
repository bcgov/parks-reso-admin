import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricsComponent } from './metrics.component';
import { MetricsFilterComponent } from './metrics-filter/metrics-filter.component';
import { DsFormsModule } from '../shared/components/ds-forms/ds-forms.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SiteMetricsComponent } from './site-metrics/site-metrics.component';
import { RouterModule } from '@angular/router';
import { MetricsRoutingModule } from './metrics-routing.module';
import { SharedMetricsModule } from '../shared/components/metrics/shared-metrics.module';


@NgModule({
  declarations: [
    MetricsComponent,
    MetricsFilterComponent,
    SiteMetricsComponent,
  ],
  imports: [
    CommonModule,
    DsFormsModule,
    ReactiveFormsModule,
    RouterModule,
    MetricsRoutingModule,
    SharedMetricsModule,
  ],
  providers: [],
})
export class MetricsModule {}
