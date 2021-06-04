import { Routes } from '@angular/router';
import { ParkRoutes } from 'app/park/park-routes';
import { ParkComponent } from 'app/park/park.component';
import { ParkFormComponent } from 'app/park-form/park-form.component';
import { ParkListComponent } from './park-list/park-list.component';
import { ParksResolverService } from './parks-resolver.service';

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
      module: 'parks',
      component: 'list'
    },
    resolve: {
      ParksResolverService
    }
  },
  {
    path: 'add',
    component: ParkFormComponent,
    data: {
      breadcrumb: 'Add Park',
      module: 'parks',
      component: 'add'
    }
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
