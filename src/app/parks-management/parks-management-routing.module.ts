import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { FacilityDetailsComponent } from './facility-details/facility-details.component';
import { ParkDetailsComponent } from './park-details/park-details.component';
import { ParkEditComponent } from './park-edit/park-edit.component';
import { ParksListComponent } from './parks-list/parks-list.component';
import { ParkResolver } from '../resolvers/park.resolver';
import { FacilityEditComponent } from './facility-edit/facility-edit.component';
import { FacilityDetailsResolver } from '../resolvers/facility-details.resolver';

const routes: Routes = [
  {
    path: '',
    component: ParksListComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: '',
      module: 'park',
      component: '',
    },
  },
  {
    path: ':parkId',
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'PARK NAME',
      module: 'park',
      component: 'main',
    },
    resolve: [ParkResolver],
    children: [
      {
        path: '',
        component: ParkDetailsComponent,
        canActivate: [AuthGuard],
        data: {
          label: '',
          breadcrumb: '',
        },
      },
      {
        path: 'edit',
        component: ParkEditComponent,
        canActivate: [AuthGuard],
        data: {
          label: 'Edit',
          breadcrumb: 'Edit',
        },
      },
      {
        path: 'add-facility',
        component: FacilityEditComponent,
        canActivate: [AuthGuard],
        data: {
          label: 'Add Facility',
          breadcrumb: 'Add Facility',
        },
      },
      {
        path: ':facilityId',
        canActivate: [AuthGuard],
        data: {
          breadcrumb: 'FACILITY NAME',
          module: 'facility',
          component: 'main',
        },
        children: [
          {
            path: '',
            component: FacilityDetailsComponent,
            resolve: [FacilityDetailsResolver],
            canActivate: [AuthGuard],
            data: {
              label: '',
              breadcrumb: '',
            },
          },
          {
            path: 'edit',
            component: FacilityEditComponent,
            canActivate: [AuthGuard],
            data: {
              label: 'Edit',
              breadcrumb: 'Edit',
            },
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParksManagementRoutingModule {}
