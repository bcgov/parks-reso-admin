import { Routes } from '@angular/router';
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
    },
  },
  // {
  //   path: 'edit',
  //   data: {
  //     breadcrumb: 'Edit Facility',
  //   },
  // }
];
