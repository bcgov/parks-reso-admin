import { Routes } from '@angular/router';
import { PassDetailsComponent } from './pass-details/pass-details.component';

export const PassRoutes: Routes = [
  {
    path: '',
    redirectTo: 'details',
    pathMatch: 'full'
  },
  {
    path: 'details',
    component: PassDetailsComponent,
    data: {
      breadcrumb: 'Details',
      module: 'pass',
      component: 'details'
    }
  }
];
