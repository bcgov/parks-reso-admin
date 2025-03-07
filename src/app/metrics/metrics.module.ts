import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricsComponent } from './metrics.component';
import { MetricsFilterComponent } from './metrics-filter/metrics-filter.component';
import { DsFormsModule } from '../shared/components/ds-forms/ds-forms.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SiteMetricsComponent } from './site-metrics/site-metrics.component';
import { RouterModule } from '@angular/router';
import { MetricsRoutingModule } from './metrics-routing.module';



@NgModule({
    imports: [
    CommonModule,
    DsFormsModule,
    ReactiveFormsModule,
    RouterModule,
    MetricsRoutingModule,
    MetricsComponent,
    MetricsFilterComponent,
    SiteMetricsComponent,
],
    providers: [],
})
export class MetricsModule {}
