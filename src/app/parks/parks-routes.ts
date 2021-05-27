import { Routes } from '@angular/router';
import { ParkRoutes } from 'app/park/park-routes';
import { ParkComponent } from 'app/park/park.component';
import { ParkAddComponent } from './park-add/park-add.component';
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
    component: ParkComponent,
    data: {
      breadcrumb: 'NAME OF THE PARK'
    },
    children: ParkRoutes
  }
];
