import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { LoginComponent } from './login/login.component';
import { FacilityEditComponent } from './facility-edit/facility-edit.component';
import { PassDetailsComponent } from './pass-details/pass-details.component';
import { FacilityDetailsComponent } from './facility-details/facility-details.component';
import { ParksListComponent } from './parks/parks-list/parks-list.component';
import { ParkDetailsComponent } from './parks/park-details/park-details.component';
import { ParkEditComponent } from './parks/park-edit/park-edit.component';
import { ParkResolver } from './resolvers/park.resolver';

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
    component: ParksListComponent,
    canActivate: [AuthGuard],
    data: {
      label: 'Parks Management',
      breadcrumb: 'Parks',
    },
  },
  {
    path: 'park/:parkId',
    component: ParkDetailsComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'PARK NAME',
      module: 'park',
      component: 'main',
    },
    resolve: [ParkResolver],
    children: [
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
        component: FacilityDetailsComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: 'FACILITY NAME',
          module: 'facility',
          component: 'main',
        },
        children: [
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
            component: PassDetailsComponent,
            canActivate: [AuthGuard],
            data: {
              breadcrumb: 'PASS NAME',
              module: 'pass',
              component: 'main',
            },
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
