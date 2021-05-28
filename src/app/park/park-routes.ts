import { Routes } from '@angular/router';
import { ParkDetailsComponent } from './park-details/park-details.component';
import { ParkEditComponent } from './park-edit/park-edit.component';

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
    component: ParkEditComponent,
    data: {
      breadcrumb: 'Edit Park',
    },
  }
];
