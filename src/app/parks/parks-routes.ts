import { Routes } from '@angular/router';
import { FacilitiesRoutes } from 'app/facilities/facilities-routes';
import { FacilitiesComponent } from 'app/facilities/facilities.component';
import { ParkAddComponent } from './park-add/park-add.component';
import { ParkDetailsComponent } from './park-details/park-details.component';
import { ParkEditComponent } from './park-edit/park-edit.component';
import { ParkListComponent } from './park-list/park-list.component';

export const ParksRoutes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: ParkListComponent,
    data: {
      breadcrumb: 'List',
    }
  },
  {
    path: 'add',
    component: ParkAddComponent,
    data: {
      breadcrumb: 'Add Park',
    },
  },
  {
    path: ':parkId',
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
        component: ParkDetailsComponent,
        data: {
          breadcrumb: 'Details',
        }
      },
      {
        path: 'facilities',
        component: FacilitiesComponent,
        data: {
          breadcrumb: 'Facilities',
        },
        children: FacilitiesRoutes
      },
      {
        path: 'edit',
        component: ParkEditComponent,
        data: {
          breadcrumb: 'Edit Park',
        },
      }
    ]
  }
];
