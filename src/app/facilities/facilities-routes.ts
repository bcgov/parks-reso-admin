import { Routes } from '@angular/router';
import { FacilityAddComponent } from './facility-add/facility-add.component';
import { FacilityDetailsComponent } from './facility-details/facility-details.component';
import { FacilityEditComponent } from './facility-edit/facility-edit.component';
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
    }
  },
  {
    path: 'add',
    component: FacilityAddComponent,
    data: {
      breadcrumb: 'Add Facility',
    },
  },
  {
    path: ':facilityId',
    data: {
      breadcrumb: null
    },
    children: [
      {
        path: '',
        redirectTo: 'details',
        pathMatch: 'full'
      },
      {
        path: 'details',
        component: FacilityDetailsComponent,
        data: {
          breadcrumb: 'Facility Details',
        },
      },
      {
        path: 'edit',
        component: FacilityEditComponent,
        data: {
          breadcrumb: 'Edit Facility',
        },
      }
    ]
  }
];
