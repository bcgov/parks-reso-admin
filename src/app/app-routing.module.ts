import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { LoginComponent } from './login/login.component';
import { ParksManagementComponent } from './parks-management/parks-management.component';
import { MetricsComponent } from './metrics/metrics.component';
import { MetricsResolver } from './resolvers/metrics.resolver';

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
    component: ParksManagementComponent,
    data: {
      label: 'Parks Management',
      breadcrumb: 'Parks',
    },
    loadChildren: () =>
      import('./parks-management/parks-management.module').then(
        (m) => m.ParksManagementModule
      ),
  },
  {
    path: 'metrics',
    canActivate: [AuthGuard],
    component: MetricsComponent,
    resolve: [MetricsResolver],
    data: {
      label: 'Metrics',
      breadcrumb: 'Metrics',
    },
    loadChildren: () =>
      import('./metrics/metrics.module').then((m) => m.MetricsModule),
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
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
