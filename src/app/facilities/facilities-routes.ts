import { Routes } from '@angular/router';
import { AuthGuard } from 'app/guards/auth.guard';
import { FacilityAddComponent } from './facility-add/facility-add.component';
import { FacilityListComponent } from './facility-list/facility-list.component';

export const FacilitiesRoutes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: FacilityListComponent,
    data: {
      breadcrumb: 'List',
      module: 'facilities',
      component: 'list'
    }
  },
  {
    path: 'add',
    component: FacilityAddComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Add Facility',
      module: 'facilities',
      component: 'add',
      roles: ['sysadmin']
    },
  }
];
