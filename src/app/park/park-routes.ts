import { Routes } from '@angular/router';
import { FacilityRoutes } from 'app/facility/facility-routes';
import { FacilityComponent } from 'app/facility/facility.component';
import { ParkDetailsComponent } from './park-details/park-details.component';

export const ParkRoutes: Routes = [
  {
    path: '',
    redirectTo: 'details',
    pathMatch: 'full'
  },
  {
    path: 'details',
    component: ParkDetailsComponent,
    data: {
      breadcrumb: 'Details',
      module: 'park',
      component: 'details'
    }
  },
  {
    path: 'facility/:facilityId',
    component: FacilityComponent,
    data: {
      breadcrumb: 'NAME OF THE Facility'
    },
    children: FacilityRoutes
  }
];
