import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { LoginComponent } from './login/login.component';
import { FacilityEditComponent } from './facilities/facility-edit/facility-edit.component';
import { PassDetailsComponent } from './pass-details/pass-details.component';
import { FacilityDetailsComponent } from './facilities/facility-details/facility-details.component';
import { ParksListComponent } from './parks/parks-list/parks-list.component';
import { ParkDetailsComponent } from './parks/park-details/park-details.component';
import { ParkEditComponent } from './parks/park-edit/park-edit.component';
import { ParkResolver } from './resolvers/park.resolver';
import { FacilityResolver } from './resolvers/facility.resolver';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    data: {
      label: 'Home',
      breadcrumb: 'Home',
    },
  },
  {
    path: 'parks',
    canActivate: [AuthGuard],
    data: {
      label: 'Parks Management',
      breadcrumb: 'Parks',
    },
    children: [
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
            path: ':facilityId',
            canActivate: [AuthGuard],
            resolve: [FacilityResolver],
            data: {
              breadcrumb: 'FACILITY NAME',
              module: 'facility',
              component: 'main',
            },
            children: [
              {
                path: '',
                component: FacilityDetailsComponent,
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
              {
                path: ':passId',
                canActivate: [AuthGuard],
                data: {
                  breadcrumb: 'PASS NAME',
                  module: 'pass',
                  component: 'main',
                },
                children: [
                  {
                    path: '',
                    component: PassDetailsComponent,
                    canActivate: [AuthGuard],
                    data: {
                      breadcrumb: '',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: 'unauthorized',
    pathMatch: 'full',
    component: NotAuthorizedComponent,
    data: {
      showSideBar: false,
      showBreadCrumb: false,
    },
    children: [],
  },
  {
    path: 'login',
    pathMatch: 'full',
    component: LoginComponent,
    data: {
      showSideBar: false,
      showBreadCrumb: false,
    },
  },
  {
    // wildcard route
    path: '**',
    redirectTo: '/',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
