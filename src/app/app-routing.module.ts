import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { HomeComponent } from './home/home.component';
import { MetricsComponent } from './metrics/metrics.component';
import { ReservationsComponent } from './reservations/reservations.component';

// Routes
import { ParksRoutes } from './parks/parks-routes';
import { ParksComponent } from './parks/parks.component';

import { AuthGuard } from './guards/auth.guard';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: 'login',
    pathMatch: 'full',
    component: LoginComponent,
    data: { showSideBar: false, showBreadCrumb: false }
  },
  {
    path: 'unauthorized',
    pathMatch: 'full',
    component: NotAuthorizedComponent,
    data: { showSideBar: false, showBreadCrumb: false }
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'parks',
    component: ParksComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Parks'
    },
    children: ParksRoutes
  },
  {
    path: 'reservations',
    component: ReservationsComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Reservations'
    }
  },
  {
    path: 'metrics',
    component: MetricsComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Site Metrics'
    }
  },
  {
    // wildcard route
    path: '**',
    redirectTo: '/',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
