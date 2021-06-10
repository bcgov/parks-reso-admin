import { Routes } from '@angular/router';
import { FacilityFormComponent } from 'app/facility-form/facility-form.component';
import { PassRoutes } from 'app/pass/pass-routes';
import { PassComponent } from 'app/pass/pass.component';
import { FacilityDetailsComponent } from './facility-details/facility-details.component';

export const FacilityRoutes: Routes = [
  {
    path: '',
    redirectTo: 'details',
    pathMatch: 'full'
  },
  {
    path: 'details',
    component: FacilityDetailsComponent,
    data: {
      breadcrumb: 'Details',
      module: 'facility',
      component: 'details'
    }
  },
  {
    path: 'edit',
    component: FacilityFormComponent,
    data: {
      breadcrumb: 'Edit Facility',
      module: 'facility',
      component: 'edit'
    },
  },
  {
    path: 'pass/:parkId',
    component: PassComponent,
    data: {
      breadcrumb: 'REGISTRATION NUMBER',
      module: 'pass',
      component: 'main'
    },
    children: PassRoutes
  }
];
