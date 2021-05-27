import { Routes } from '@angular/router';
import { ParkFormComponent } from 'app/park-form/park-form.component';
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
    }
  },
  {
    path: 'edit',
    component: ParkFormComponent,
    data: {
      breadcrumb: 'Edit Park',
    },
  }
];
