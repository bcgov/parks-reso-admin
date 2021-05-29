import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { HomeComponent } from './home/home.component';
import { MetricsComponent } from './metrics/metrics.component';
import { ReservationsComponent } from './reservations/reservations.component';

// Routes
import { ParksRoutes } from './parks/parks-routes';
import { ParksComponent } from './parks/parks.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'parks',
    component: ParksComponent,
    data: {
      breadcrumb: 'Parks'
    },
    children: ParksRoutes
  },
  {
    path: 'reservations',
    component: ReservationsComponent,
    data: {
      breadcrumb: 'Reservations',
    },
  },
  {
    path: 'metrics',
    component: MetricsComponent,
    data: {
      breadcrumb: 'Site Metrics'
    },
  },
  {
    // wildcard route
    path: '**',
    redirectTo: '/',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
  ]
})

export class AppRoutingModule { }
