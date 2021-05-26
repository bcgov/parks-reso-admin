import { Routes } from '@angular/router';
import { FacilitiesRoutes } from 'app/facilities/facilities-routes';
import { ParkAddComponent } from './park-add/park-add.component';
import { ParkDetailsComponent } from './park-details/park-details.component';
import { ParkEditComponent } from './park-edit/park-edit.component';
import { ParkListComponent } from './park-list/park-list.component';

export const ParksRoutes: Routes = [
  {
    path: '',
    component: ParkListComponent,
  },
  {
    path: ':parkId',
    children: [
      {
        path: '',
        redirectTo: 'details',
        pathMatch: 'full'
      },
      {
        path: 'details',
        component: ParkDetailsComponent
      },
      {
        path: 'facilities',
        children: FacilitiesRoutes
      },
      {
        path: 'add',
        component: ParkAddComponent
      },
      {
        path: 'edit',
        component: ParkEditComponent
      }
    ]
  }
];
