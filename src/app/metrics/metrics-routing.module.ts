import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { MetricsComponent } from './metrics.component';

const routes: Routes = [
  {
    path: '',
    component: MetricsComponent,
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
