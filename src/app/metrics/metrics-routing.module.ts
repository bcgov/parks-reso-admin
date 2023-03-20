import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { SiteMetricsComponent } from './site-metrics/site-metrics.component';

const routes: Routes = [
  {
    path: '',
    component: SiteMetricsComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: '',
      module: 'metrics',
      component: '',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MetricsRoutingModule {}
